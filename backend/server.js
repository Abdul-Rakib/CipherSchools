import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";
import helmet from "helmet";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import s3Routes from "./routes/s3.js";
import userRoutes from "./routes/user.js";
import projectRoutes from "./routes/project.js";
import fileRoutes from "./routes/file.js";

dotenv.config();

const app = express();

const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];

const allowedOrigins = [
    ...envOrigins,
    'https://accounts.google.com',             // Google Sign-In
    'https://s3.amazonaws.com',                // S3 root
    'https://*.s3.amazonaws.com',              // Wildcard S3 support
    'https://*.s3.ap-south-1.amazonaws.com'    // Regional S3 buckets
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Server-to-server

        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed.includes('*')) {
                const regex = new RegExp(
                    '^' + allowed.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
                );
                return regex.test(origin);
            }
            return origin === allowed;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked: ${origin}`);
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "https://accounts.google.com",
                "https://www.gstatic.com"
            ],
            connectSrc: [
                "'self'",
                "https://printlabs-bucket.s3.ap-south-1.amazonaws.com"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https://printlabs-bucket.s3.ap-south-1.amazonaws.com"
            ],
            styleSrc: ["'self'", "'unsafe-inline'"],
            frameSrc: [
                "'self'",
                "https://accounts.google.com"
            ],
        },
    })
);

// Middleware
app.use(cookieParser());
app.use(express.json()); // for JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // for form submissions

// Error handler for malformed JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ success: false, msg: 'Invalid JSON format in request body' });
    }
    next();
});

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/s3", s3Routes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/files", fileRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/templates', express.static(path.join(__dirname, 'templates')));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.all('/{*any}', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running in development mode.");
    });
}

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });