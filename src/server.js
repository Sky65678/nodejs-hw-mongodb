import 'dotenv/config';

import app from './app.js';
import { initDatabaseConection } from './db.js';

export async function setupServer() {
  const PORT = process.env.PORT;

  try {
    await initDatabaseConection();

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

setupServer();
