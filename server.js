// This file redirects to the actual entry point in the server directory
// It helps resolve "Cannot find module 'server.js'" errors on platforms like Render
require('./server/index.js');
