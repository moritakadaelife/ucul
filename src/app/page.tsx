"use client";

import { useState, useRef } from 'react';

import axios from 'axios';

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ResponseData {
  request_id: string;
  // 他のプロパティ
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [fileList, setFileList] = useState<{ name: string; requestId: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
    setMessage(''); // ファイルが選択されたらメッセージをクリアする
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
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
            '/api/upload', // ローカルのプロキシ経由でAPIを呼び出す
            base64data,
            {
              headers: {
                'X-API-Key': 'Fc7lslJVkP6Xr9dbkolZcPICL91IIMA6txhPg5Aj',
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
    try {
      const url = `https://cd2g26sz16.execute-api.ap-northeast-1.amazonaws.com/api/request/${requestId}`;
      const response = await axios.get(url, {
        headers: {
          'X-API-Key': 'Fc7lslJVkP6Xr9dbkolZcPICL91IIMA6txhPg5Aj',
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
            <li className="elads-project-nav-list__item is-active">
              MUJI
            </li>
            <li className="elads-project-nav-list__item">
              ユニチャーム
            </li>
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
