import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const API = 'http://localhost:4000';
const socket = io(API);

export default function App() {
  const [disasters, setDisasters] = useState([]);
  const [reports, setReports] = useState([]);
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ title: '', location_name: '', description: '', tags: '' });
  const [reportForm, setReportForm] = useState({ disaster_id: '', content: '', image_url: '' });
  const [resourceQuery, setResourceQuery] = useState({ lat: '', lon: '' });
  const [geocodeInput, setGeocodeInput] = useState('');
  const [geocodeResult, setGeocodeResult] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [officialUpdates, setOfficialUpdates] = useState([]);
  const [verifyImageUrl, setVerifyImageUrl] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [resourceForm, setResourceForm] = useState({ disaster_id: '', name: '', location_name: '', type: '', lat: '', lon: '' });

  const fetchDisasters = () => {
    fetch(`${API}/disasters`)
      .then(r => r.json())
      .then(setDisasters);
  };
  useEffect(fetchDisasters, []);

  const fetchReports = (disaster_id) => {
    if (disaster_id) {
      fetch(`${API}/reports/${disaster_id}`)
        .then(r => r.json())
        .then(setReports);
      fetch(`${API}/disasters/${disaster_id}/social-media`)
        .then(r => r.json())
        .then(setSocialMedia);
      fetch(`${API}/disasters/${disaster_id}/official-updates`)
        .then(r => r.json())
        .then(setOfficialUpdates);
      fetch(`${API}/resources?lat=&lon=&disaster_id=${disaster_id}`)
        .then(r => r.json())
        .then(setResources);
    }
  };
  useEffect(() => {
    fetchReports(reportForm.disaster_id);
  }, [reportForm.disaster_id]);

  useEffect(() => {
    socket.on('disaster_updated', () => {
      fetchDisasters();
    });
    return () => {
      socket.off('disaster_updated');
    };
  }, []);

  const handleDisasterChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleReportChange = e => setReportForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleResourceQueryChange = e => setResourceQuery(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleGeocodeInput = e => setGeocodeInput(e.target.value);
  const handleVerifyImageUrl = e => setVerifyImageUrl(e.target.value);
  const handleResourceFormChange = e => setResourceForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const createDisaster = async e => {
    e.preventDefault();
    const res = await fetch(`${API}/disasters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user': 'netrunnerX' },
      body: JSON.stringify({ ...form, tags: form.tags.split(',').map(t => t.trim()) })
    });
    const data = await res.json();
    setDisasters(disasters => [...disasters, data]);
  };

  const submitReport = async e => {
    e.preventDefault();
    const res = await fetch(`${API}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user': 'citizen1' },
      body: JSON.stringify(reportForm)
    });
    const data = await res.json();
    setReports(reports => [...reports, data]);
  };

  const queryResources = async e => {
    e.preventDefault();
    const { lat, lon } = resourceQuery;
    const res = await fetch(`${API}/resources?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    setResources(data);
  };

  const geocode = async e => {
    e.preventDefault();
    const res = await fetch(`${API}/geocode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: geocodeInput })
    });
    const data = await res.json();
    setGeocodeResult(data);
  };

  const verifyImage = async e => {
    e.preventDefault();
    if (!reportForm.disaster_id) return;
    const res = await fetch(`${API}/disasters/${reportForm.disaster_id}/verify-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: verifyImageUrl })
    });
    const data = await res.json();
    setVerifyResult(data);
  };

  const createResource = async e => {
    e.preventDefault();
    const { disaster_id, name, location_name, type, lat, lon } = resourceForm;
    const location = lat && lon ? `SRID=4326;POINT(${lon} ${lat})` : null;
    const res = await fetch(`${API}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user': 'reliefAdmin' },
      body: JSON.stringify({ disaster_id, name, location_name, type, location })
    });
    const data = await res.json();
    setResources(resources => [...resources, data]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Disaster Response Platform</h1>

      <h2>Create Disaster</h2>
      <form onSubmit={createDisaster}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleDisasterChange} required />
        <input name="location_name" placeholder="Location Name" value={form.location_name} onChange={handleDisasterChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleDisasterChange} />
        <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleDisasterChange} />
        <button type="submit">Create</button>
      </form>

      <h2>Disasters</h2>
      <ul>
        {disasters.map(d => (
          <li key={d.id}>
            <b>{d.title}</b> ({d.location_name}) - {d.description} [Tags: {d.tags?.join(', ')}]
            <button onClick={() => setReportForm(f => ({ ...f, disaster_id: d.id }))}>View Reports</button>
          </li>
        ))}
      </ul>

      <h2>Submit Report</h2>
      <form onSubmit={submitReport}>
        <select name="disaster_id" value={reportForm.disaster_id} onChange={handleReportChange} required>
          <option value="">Select Disaster</option>
          {disasters.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
        <input name="content" placeholder="Content" value={reportForm.content} onChange={handleReportChange} />
        <input name="image_url" placeholder="Image URL" value={reportForm.image_url} onChange={handleReportChange} />
        <button type="submit">Submit</button>
      </form>

      <h2>Reports</h2>
      <ul>
        {reports.map(r => (
          <li key={r.id}>{r.content} (Image: {r.image_url}) - Status: {r.verification_status}</li>
        ))}
      </ul>

      <h2>Verify Image</h2>
      <form onSubmit={verifyImage}>
        <input value={verifyImageUrl} onChange={handleVerifyImageUrl} placeholder="Image URL to verify" />
        <button type="submit" disabled={!reportForm.disaster_id}>Verify</button>
      </form>
      {verifyResult && (
        <div>Verification: {verifyResult.status} - {verifyResult.details}</div>
      )}

      <h2>Social Media</h2>
      <ul>
        {socialMedia.map((s, i) => (
          <li key={i}>{s.post} (by {s.user})</li>
        ))}
      </ul>

      <h2>Official Updates</h2>
      <ul>
        {officialUpdates.map((u, i) => (
          <li key={i}>{u.source}: {u.update}</li>
        ))}
      </ul>

      <h2>Geocode Location</h2>
      <form onSubmit={geocode}>
        <input value={geocodeInput} onChange={handleGeocodeInput} placeholder="Describe location (e.g. Flood in Manhattan)" />
        <button type="submit">Geocode</button>
      </form>
      {geocodeResult && (
        <div>Result: {geocodeResult.location_name} ({geocodeResult.lat}, {geocodeResult.lon})</div>
      )}

      <h2>Query Resources Near Location</h2>
      <form onSubmit={queryResources}>
        <input name="lat" value={resourceQuery.lat} onChange={handleResourceQueryChange} placeholder="Latitude" />
        <input name="lon" value={resourceQuery.lon} onChange={handleResourceQueryChange} placeholder="Longitude" />
        <button type="submit">Query</button>
      </form>
      <ul>
        {resources.map(r => (
          <li key={r.id}>{r.name} ({r.type}) at {r.location_name}</li>
        ))}
      </ul>

      <h2>Add Resource</h2>
      <form onSubmit={createResource}>
        <select name="disaster_id" value={resourceForm.disaster_id} onChange={handleResourceFormChange} required>
          <option value="">Select Disaster</option>
          {disasters.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
        <input name="name" placeholder="Resource Name" value={resourceForm.name} onChange={handleResourceFormChange} required />
        <input name="location_name" placeholder="Location Name" value={resourceForm.location_name} onChange={handleResourceFormChange} />
        <input name="type" placeholder="Type (e.g. shelter)" value={resourceForm.type} onChange={handleResourceFormChange} />
        <input name="lat" placeholder="Latitude" value={resourceForm.lat} onChange={handleResourceFormChange} />
        <input name="lon" placeholder="Longitude" value={resourceForm.lon} onChange={handleResourceFormChange} />
        <button type="submit">Add Resource</button>
      </form>
    </div>
  );
}
