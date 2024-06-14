"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      setUploadedFiles((prev) => [
        ...prev,
        ...data.files.map((file) => ({ filename: file.filename, originalname: file.originalname })),
      ]);
    } else {
      console.error(data.message);
    }
  };

  const handleDeleteFile = async (filename) => {
    const response = await fetch(`http://localhost:3001/delete/${filename}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setUploadedFiles((prev) => prev.filter((file) => file.filename !== filename));
    } else {
      console.error("Failed to delete file");
    }
  };

  return (
    <>
      <div className="ucul">
        <Header />
        <main className="ucul-main">
          <section className="ucul-section__upload-file">
            <h2 className="ucul-section__upload-file-title">検閲データ</h2>
            <Label className="ucul-section__upload-file-label">
              <Input id="picture" type="file" accept=".csv" multiple className="ucul-section__upload-file-input" onChange={handleFileUpload} />
            </Label>
          </section>
          <section className="ucul-section__lists">
            <table className="ucul-section__lists-table">
              <thead>
                <tr>
                  <th>ファイルリスト</th>
                  <th>ファイルリスト（検閲済み）</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file, index) => (
                  <tr key={index}>
                    <td>
                      <div className="ucul-section__lists-table-cell-aligner">
                        <span>{file.originalname}</span>
                        <Button onClick={() => handleDeleteFile(file.filename)}>Delete</Button>
                      </div>
                    </td>
                    <td>
                      <div className="ucul-section__lists-table-cell-aligner">
                        <span>{file.originalname}</span>
                        <Button onClick={() => window.location.href = `http://localhost:3001/download/${file.filename}`}>Download</Button>
                        <Button onClick={() => handleDeleteFile(file.filename)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
