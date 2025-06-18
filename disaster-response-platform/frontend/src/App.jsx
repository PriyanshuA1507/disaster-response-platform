import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Tabs, Tab, Paper, Grid, Divider, Button, TextField,
  Card, CardContent, List, ListItem, ListItemText, Select, MenuItem, InputLabel, FormControl, Alert, IconButton
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ReportIcon from '@mui/icons-material/Report';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';
import InfoIcon from '@mui/icons-material/Info';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const API = 'https://disaster-response-platform-a5tc.onrender.com'; // Change to your backend URL

function TabPanel({ children, value, index }) {
  return value === index && <Box sx={{ py: 2 }}>{children}</Box>;
}

export default function App() {
  // UI State
  const [tab, setTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // App State
  const [disasters, setDisasters] = useState([]);
  const [reports, setReports] = useState([]);
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ title: '', location_name: '', description: '', tags: '' });
  const [reportForm, setReportForm] = useState({ disaster_id: '', content: '', image_url: '' });
  const [resourceForm, setResourceForm] = useState({ disaster_id: '', name: '', location_name: '', type: '', lat: '', lon: '' });
  const [resourceQuery, setResourceQuery] = useState({ lat: '', lon: '' });
  const [geocodeInput, setGeocodeInput] = useState('');
  const [geocodeResult, setGeocodeResult] = useState(null);
  const [socialMedia, setSocialMedia] = useState([]);
  const [officialUpdates, setOfficialUpdates] = useState([]);
  const [verifyImageUrl, setVerifyImageUrl] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  // Fetch disasters
  useEffect(() => {
    fetch(`${API}/disasters`)
      .then(r => r.json())
      .then(setDisasters);
  }, []);

  // Fetch reports, social, updates, resources for selected disaster
  useEffect(() => {
    if (reportForm.disaster_id) {
      fetch(`${API}/reports/${reportForm.disaster_id}`)
        .then(r => r.json())
        .then(setReports);
      fetch(`${API}/disasters/${reportForm.disaster_id}/social-media`)
        .then(r => r.json())
        .then(setSocialMedia);
      fetch(`${API}/disasters/${reportForm.disaster_id}/official-updates`)
        .then(r => r.json())
        .then(setOfficialUpdates);
      fetch(`${API}/resources?lat=&lon=&disaster_id=${reportForm.disaster_id}`)
        .then(r => r.json())
        .then(setResources);
      setSelectedDisaster(reportForm.disaster_id);
    }
  }, [reportForm.disaster_id]);

  // Handlers
  const handleDisasterChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleReportChange = e => setReportForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleResourceFormChange = e => setResourceForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleResourceQueryChange = e => setResourceQuery(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleGeocodeInput = e => setGeocodeInput(e.target.value);
  const handleVerifyImageUrl = e => setVerifyImageUrl(e.target.value);

  const createDisaster = async e => {
    e.preventDefault();
    const res = await fetch(`${API}/disasters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user': 'netrunnerX' },
      body: JSON.stringify({ ...form, tags: form.tags.split(',').map(t => t.trim()) })
    });
    const data = await res.json();
    setDisasters(disasters => [...disasters, data]);
    setForm({ title: '', location_name: '', description: '', tags: '' });
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
    setReportForm(f => ({ ...f, content: '', image_url: '' }));
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
    setResourceForm({ disaster_id: '', name: '', location_name: '', type: '', lat: '', lon: '' });
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

  return (
    <Box sx={{ bgcolor: darkMode ? '#121212' : '#f4f6fa', minHeight: '100vh', width: '100vw', px: 0 }}>
      {/* AppBar/Header */}
      <AppBar position="static" color="primary" enableColorOnDark sx={{ width: '100vw' }}>
        <Toolbar>
          <PublicIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Disaster Response Platform
          </Typography>
          <IconButton color="inherit" onClick={() => setDarkMode(m => !m)}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content - Full Width */}
      <Box sx={{ width: '100vw', maxWidth: '100vw', px: { xs: 1, sm: 2, md: 4 }, py: 4, mx: 0 }}>
        {/* Tabs for navigation */}
        <Paper elevation={3} sx={{ mb: 3, mx: 0, width: '100%' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Disasters" icon={<LocationOnIcon />} iconPosition="start" />
            <Tab label="Reports" icon={<ReportIcon />} iconPosition="start" />
            <Tab label="Resources" icon={<AddCircleIcon />} iconPosition="start" />
            <Tab label="Tools" icon={<InfoIcon />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Disasters Tab */}
        <TabPanel value={tab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {/* Create Disaster */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    <AddCircleIcon color="primary" /> Create Disaster
                  </Typography>
                  <Box component="form" onSubmit={createDisaster} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Title" name="title" value={form.title} onChange={handleDisasterChange} required />
                    <TextField label="Location Name" name="location_name" value={form.location_name} onChange={handleDisasterChange} />
                    <TextField label="Description" name="description" value={form.description} onChange={handleDisasterChange} />
                    <TextField label="Tags (comma separated)" name="tags" value={form.tags} onChange={handleDisasterChange} />
                    <Button type="submit" variant="contained" color="primary">Create</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Disasters List */}
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    <LocationOnIcon color="secondary" /> Disasters
                  </Typography>
                  <List>
                    {disasters.map(d => (
                      <ListItem
                        key={d.id}
                        sx={{
                          bgcolor: d.id === selectedDisaster ? '#e3f2fd' : 'inherit',
                          borderRadius: 2,
                          mb: 1,
                          boxShadow: d.id === selectedDisaster ? 2 : 0,
                        }}
                        secondaryAction={
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => setReportForm(f => ({ ...f, disaster_id: d.id }))}
                          >
                            View Details
                          </Button>
                        }
                      >
                        <ListItemText
                          primary={<b>{d.title}</b>}
                          secondary={`${d.location_name} - ${d.description} [Tags: ${d.tags?.join(', ')}]`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={tab} index={1}>
          <Grid container spacing={3}>
            {/* Submit Report */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ReportIcon color="error" /> Submit Report
                  </Typography>
                  <Box component="form" onSubmit={submitReport} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Select Disaster</InputLabel>
                      <Select
                        name="disaster_id"
                        value={reportForm.disaster_id}
                        label="Select Disaster"
                        onChange={handleReportChange}
                        required
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {disasters.map(d => <MenuItem key={d.id} value={d.id}>{d.title}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <TextField label="Content" name="content" value={reportForm.content} onChange={handleReportChange} />
                    <TextField label="Image URL" name="image_url" value={reportForm.image_url} onChange={handleReportChange} />
                    <Button type="submit" variant="contained" color="error">Submit</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Reports List */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Reports
                  </Typography>
                  <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {reports.map(r => (
                      <ListItem key={r.id}>
                        <ListItemText
                          primary={r.content}
                          secondary={
                            <>
                              <span style={{ color: '#888' }}>Image: {r.image_url}</span>
                              <br />
                              <span style={{ color: r.verification_status === 'verified' ? '#43a047' : '#d32f2f' }}>
                                Status: {r.verification_status}
                              </span>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* Verify Image */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CheckCircleIcon color="success" /> Verify Image
              </Typography>
              <Box component="form" onSubmit={verifyImage} sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Image URL to verify"
                  value={verifyImageUrl}
                  onChange={handleVerifyImageUrl}
                  fullWidth
                />
                <Button type="submit" variant="contained" color="success" disabled={!reportForm.disaster_id}>
                  Verify
                </Button>
              </Box>
              {verifyResult && (
                <Alert severity={verifyResult.status === 'verified' ? 'success' : 'error'} sx={{ mt: 2 }}>
                  Verification: {verifyResult.status} - {verifyResult.details}
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabPanel>

        {/* Resources Tab */}
        <TabPanel value={tab} index={2}>
          <Grid container spacing={3}>
            {/* Add Resource */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <AddCircleIcon color="primary" /> Add Resource
                  </Typography>
                  <Box component="form" onSubmit={createResource} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Select Disaster</InputLabel>
                      <Select
                        name="disaster_id"
                        value={resourceForm.disaster_id}
                        label="Select Disaster"
                        onChange={handleResourceFormChange}
                        required
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {disasters.map(d => <MenuItem key={d.id} value={d.id}>{d.title}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <TextField label="Resource Name" name="name" value={resourceForm.name} onChange={handleResourceFormChange} required />
                    <TextField label="Location Name" name="location_name" value={resourceForm.location_name} onChange={handleResourceFormChange} />
                    <TextField label="Type (e.g. shelter)" name="type" value={resourceForm.type} onChange={handleResourceFormChange} />
                    <TextField label="Latitude" name="lat" value={resourceForm.lat} onChange={handleResourceFormChange} />
                    <TextField label="Longitude" name="lon" value={resourceForm.lon} onChange={handleResourceFormChange} />
                    <Button type="submit" variant="contained" color="primary">Add Resource</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Query Resources */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Query Resources Near Location
                  </Typography>
                  <Box component="form" onSubmit={queryResources} sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Latitude"
                      name="lat"
                      value={resourceQuery.lat}
                      onChange={handleResourceQueryChange}
                    />
                    <TextField
                      label="Longitude"
                      name="lon"
                      value={resourceQuery.lon}
                      onChange={handleResourceQueryChange}
                    />
                    <Button type="submit" variant="contained" color="primary">Query</Button>
                  </Box>
                  <List sx={{ maxHeight: 100, overflow: 'auto' }}>
                    {resources.map(r => (
                      <ListItem key={r.id}>
                        <ListItemText primary={`${r.name} (${r.type})`} secondary={r.location_name} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tools Tab */}
        <TabPanel value={tab} index={3}>
          <Grid container spacing={3}>
            {/* Geocode Location */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Geocode Location
                  </Typography>
                  <Box component="form" onSubmit={geocode} sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Describe location (e.g. Flood in Manhattan)"
                      value={geocodeInput}
                      onChange={handleGeocodeInput}
                      fullWidth
                    />
                    <Button type="submit" variant="contained" color="primary">Geocode</Button>
                  </Box>
                  {geocodeResult && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Result: <b>{geocodeResult.location_name}</b> ({geocodeResult.lat}, {geocodeResult.lon})
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
            {/* Social Media */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Social Media
                  </Typography>
                  <List sx={{ maxHeight: 120, overflow: 'auto' }}>
                    {socialMedia.map((s, i) => (
                      <ListItem key={i}>
                        <ListItemText primary={s.post} secondary={`by ${s.user}`} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
              {/* Official Updates */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Official Updates
                  </Typography>
                  <List sx={{ maxHeight: 120, overflow: 'auto' }}>
                    {officialUpdates.map((u, i) => (
                      <ListItem key={i}>
                        <ListItemText primary={u.update} secondary={u.source} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', py: 2, color: darkMode ? '#bbb' : '#888', width: '100vw' }}>
        <Divider sx={{ mb: 1 }} />
        <Typography variant="body2">
          Disaster Response Platform &copy; {new Date().getFullYear()} | Powered by React & Material-UI
        </Typography>
      </Box>
    </Box>
  );
}