export interface Config {
  origin: string;
  port: number;
  version: string;
  database: {
    uri: string;
  };
  firebase: {
    credential: {
      clientEmail: string;
      privateKey: string;
      projectId: string;
    };
    databaseURL: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  origin: process.env.ORIGIN,
  version: process.env.VERSION,
  database: {
    uri: process.env.DATABASE_URL,
  },
  firebase: {
    credential: {
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    },
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRY,
  },
};

export default config as Config;
