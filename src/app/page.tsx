"use client";

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ResponseData {
  request_id: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [fileList, setFileList] = useState<{ name: string; requestId: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<{ [key: string]: { ENDPOINT: string; API_KEY: string } }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
    setMessage('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    if (!activeProject || !projects[activeProject]) {
      setMessage('Please select a valid project.');
      return;
    }

    const selectedProject = projects[activeProject];
    const { ENDPOINT, API_KEY } = selectedProject;

    console.log('selectedProject', selectedProject);
    console.log(ENDPOINT, API_KEY);

    if (!ENDPOINT || !API_KEY) {
      setMessage('Endpoint or API key is missing for the selected project.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const base64data = reader.result.split(',')[1];

        try {
          setIsLoading(true);
          const response = await axios.post<ResponseData>(
            '/api/upload',
            base64data,
            {
              headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'text/plain',
              },
            }
          );

          setMessage('File uploaded successfully');
          setResponseData(response.data);

          const requestId = response.data.request_id;
          setFileList([...fileList, { name: file.name, requestId }]);

          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error: any) {
          setMessage(`Error uploading file: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMessage('Error reading file.');
      }
    };

    reader.onerror = () => {
      setMessage('Error reading file.');
    };
  };

  const handleDownload = async (requestId: string, fileName: string) => {
    if (!activeProject || !projects[activeProject]) {
      setMessage('Please select a valid project.');
      return;
    }

    const { ENDPOINT, API_KEY } = projects[activeProject];
    try {
      const url = `${ENDPOINT}/${requestId}`;
      const response = await axios.get(url, {
        headers: {
          'X-API-Key': API_KEY,
        },
        responseType: 'blob', // ファイルをblob形式で取得する
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const urlObject = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlObject;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      setMessage('Error downloading file');
    }
  };

  return (
    <>
      <div className="elads">
        <Header />
        <nav className="elads-project-nav">
          <ul className="elads-project-nav-list">
            {Object.keys(projects).map((project) => (
              <li
                key={project}
                className={`elads-project-nav-list__item ${
                  activeProject === project ? 'is-active' : ''
                }`}
                onClick={() => handleTabClick(project)}
              >
                {project}
              </li>
            ))}
          </ul>
        </nav>
        <main className="elads-main">
          <section className="elads-section__upload-file">
            <h2 className="elads-section__upload-file-title">検閲データ（CSVファイルのみ）</h2>
            <form onSubmit={handleSubmit} className="elads-section__upload-file-form">
              <Label className="elads-section__upload-file-label">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="elads-section__upload-file-input"
                />
              </Label>
              <Button type="submit" className="ml-2 elads-section__upload-file-button">Upload</Button>
            </form>
            {isLoading && (
              <div className="elads-section__upload-file-loading">
                <span>Loading</span>
                <span className="dot dot-first">.</span>
                <span className="dot dot-second">.</span>
                <span className="dot dot-third">.</span>
              </div>
            )}
            {message && !isLoading && (
              <div className="elads-section__upload-file-message">
                {message && !isLoading && (
                  <span className={`${message === 'Please select a file first.' || message === 'Error downloading file' ? 'error' : ''}`}>
                    {message}
                  </span>
                )}
              </div>
            )}
          </section>
          <section className="elads-section__lists">
            <table className="elads-section__lists-table">
              <thead>
                <tr>
                  <th>ファイルリスト</th>
                  <th>ファイルリスト<small>（検閲済み）</small></th>
                </tr>
              </thead>
              <tbody>
                {fileList.map((fileData, index) => (
                  <tr key={index}>
                    <td>
                      <div className="elads-section__lists-table-cell-aligner">
                        <span>{fileData.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="elads-section__lists-table-cell-aligner">
                        <span>{fileData.name.replace('.csv', '') + '_' + fileData.requestId + '.csv'}</span>
                        <Button
                          onClick={() => handleDownload(fileData.requestId, fileData.name.replace('.csv', '') + '_' + fileData.requestId + '.csv')}
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
