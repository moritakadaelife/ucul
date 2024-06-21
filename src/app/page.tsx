"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface UploadedFile {
  filename: string;
  originalname: string;
  status: string;
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputKey, setInputKey] = useState(Date.now());
  const [projects, setProjects] = useState<{ [key: string]: { endpoint: string } }>({});
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects/');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error('No projects found');
        }
        setProjects(data);
        const firstProject = Object.keys(data)[0];
        setActiveProject(firstProject);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchProjects();
  }, []);

  const handleTabClick = (project: string) => {
    if (activeProject !== project) {
      setActiveProject(project);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("activeProject", activeProject!);  // activeProject を追加
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const uploadResponse = await fetch('/api/projects', {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        const data = await uploadResponse.json();

        if (data.files) {
          setUploadedFiles((prev) => [
            ...prev,
            ...data.files.map((file: { filename: string; originalname: string }) => ({
              filename: file.filename,
              originalname: file.originalname,
              status: "processing",
            })),
          ]);
          checkFileStatus(data.files.map((file: { filename: string }) => file.filename));
        } else {
          console.error('No files found in response data:', data);
          // エラー処理を行うか、必要に応じてデフォルトのエラーメッセージを設定します。
          setError('No files found in response data');
        }
      } else {
        const errorData = await uploadResponse.json();
        console.error("Failed to upload files", errorData);
        setError(errorData.error ?? "Unknown error occurred");
      }
    } catch (error: any) {
      console.error("Failed to upload files", error);
      setError(error.message ?? "Unknown error occurred");
    }
  };

  const checkFileStatus = async (filenames: string[]) => {
    for (const filename of filenames) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:3001/status/${filename}`);
          if (response.ok) {
            const data = await response.json();
            if (data.status === "completed") {
              clearInterval(interval);
              setUploadedFiles((prev) =>
                prev.map((file) =>
                  file.filename === filename
                    ? { ...file, status: "completed" }
                    : file
                )
              );
              setInputKey(Date.now()); // Reset file input
            }
          } else if (response.status === 404) {
            clearInterval(interval);
            console.error(`File status not found for ${filename}`);
          } else {
            console.error(`Failed to fetch status for ${filename}`);
          }
        } catch (error) {
          clearInterval(interval);
          console.error(`Error fetching status for ${filename}: ${(error as Error).message}`);
        }
      }, 5000); // Check status every 5 seconds
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="ucul">
        <Header />
        <nav className="ucul-project-nav">
          <ul className="ucul-project-nav-list">
            {Object.keys(projects).map((project) => (
              <li
                key={project}
                className={`ucul-project-nav-list__item ${
                  activeProject === project ? 'is-active' : ''
                }`}
                onClick={() => handleTabClick(project)}
              >
                {project}
              </li>
            ))}
          </ul>
        </nav>
        <main className="ucul-main">
          <section className="ucul-section__upload-file">
            <h2 className="ucul-section__upload-file-title">検閲データ（CSVファイルのみ）</h2>
            <Label className="ucul-section__upload-file-label">
              <Input
                key={inputKey}
                id="picture"
                type="file"
                accept=".csv"
                multiple
                className="ucul-section__upload-file-input"
                onChange={handleFileUpload}
              />
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
                      </div>
                    </td>
                    <td>
                      <div className="ucul-section__lists-table-cell-aligner">
                        <span>{file.originalname}</span>
                        <Button
                          onClick={() =>
                            (window.location.href = `http://localhost:3001/download/${file.filename}`)
                          }
                          disabled={file.status !== "completed"}
                        >
                          Download
                        </Button>
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
