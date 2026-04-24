import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Container,
} from "@mui/material";
import { FiCheck, FiX } from "react-icons/fi";

export default function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Container maxWidth="sm">
          <Card>
            <CardContent>
              <p>
                Simple react app with Vite + Express.js. Read{" "}
                <a
                  href="../README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  README.md
                </a>{" "}
                to get started. Or edit src/App.jsx to see changes.
              </p>
            </CardContent>
          </Card>
        </Container>
      </div>
    </>
  );
}
