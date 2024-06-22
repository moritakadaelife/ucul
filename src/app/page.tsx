"use client";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import Header from "@/app/components/Header";
// import Footer from "@/app/components/Footer";

// interface UploadResponse {
//   created_at: string;
//   request_id: string;
//   client_id: string;
//   row_count: number;
//   chunk_size: number;
// }

// interface UploadedFile {
//   filename: string;
//   originalname: string;
//   status: string;
// }

// export default function Home() {
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [inputKey, setInputKey] = useState(Date.now());
//   const [projects, setProjects] = useState<{ [key: string]: { endpoint: string; apiKey: string } }>({});
//   const [activeProject, setActiveProject] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

//   // Fetch projects on component mount
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch('/api/projects');
//         if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (!data || Object.keys(data).length === 0) {
//           throw new Error('No projects found');
//         }
//         setProjects(data);
//         const firstProject = Object.keys(data)[0];
//         setActiveProject(firstProject);
//       } catch (error: any) {
//         setError(error.message);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // Function to handle file upload
//   const handleFileUpload = async () => {

//     try {

//       if (!activeProject || !projects[activeProject]) {
//         throw new Error('Active project configuration not found');
//       }

//       const { endpoint, apiKey } = projects[activeProject];

//       if (!fileInputRef.current?.files?.length) {
//         throw new Error('Please select a file to upload');
//       }

//       const formData = new FormData();
//       formData.append('files', fileInputRef.current!.files![0]);

//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'X-API-Key': apiKey,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Upload failed with status: ${response.status}`);
//       }

//       const data: UploadResponse = await response.json();
//       console.log(data); // Log the response

//       // Update uploaded files state
//       setUploadedFiles(prevFiles => [
//         ...prevFiles,
//         {
//           filename: data.request_id,
//           originalname: fileInputRef.current!.files![0].name,
//           status: 'Uploaded',
//         },
//       ]);

//       // Reset file input
//       setInputKey(Date.now());
//     } catch (error) {
//       console.error('File upload failed:', error);
//       setError('File upload failed. Please try again.');
//     }
//   };

//   // Function to handle project tab click
//   const handleTabClick = (project: string) => {
//     if (activeProject !== project) {
//       setActiveProject(project);
//     }
//   };

//   // Render error if there's an error state
//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <>
//       <div className="elads">
//         <Header />
//         <nav className="elads-project-nav">
//           <ul className="elads-project-nav-list">
//             {Object.keys(projects).map((project) => (
//               <li
//                 key={project}
//                 className={`elads-project-nav-list__item ${
//                   activeProject === project ? 'is-active' : ''
//                 }`}
//                 onClick={() => handleTabClick(project)}
//               >
//                 {project}
//               </li>
//             ))}
//           </ul>
//         </nav>
//         <main className="elads-main">
//           <section className="elads-section__upload-file">
//             <h2 className="elads-section__upload-file-title">検閲データ（CSVファイルのみ）</h2>
//             <Label className="elads-section__upload-file-label">
//               <Input
//                 key={inputKey}
//                 id="file-upload"
//                 type="file"
//                 accept=".csv"
//                 ref={fileInputRef}
//                 multiple
//                 className="elads-section__upload-file-input"
//               />
//             </Label>
//             <Button className="ml-2" onClick={handleFileUpload}>Upload</Button>
//           </section>
//           <section className="elads-section__lists">
//             <table className="elads-section__lists-table">
//               <thead>
//                 <tr>
//                   <th>ファイルリスト</th>
//                   <th>ファイルリスト<small>（検閲済み）</small></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {uploadedFiles.map((file, index) => (
//                   <tr key={index}>
//                     <td>
//                       <div className="elads-section__lists-table-cell-aligner">
//                         <span>{file.originalname}</span>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="elads-section__lists-table-cell-aligner">
//                         <span>{file.originalname}</span>
//                         <Button>
//                           Download
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </section>
//         </main>
//         <Footer />
//       </div>
//     </>
//   );
// }


import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event: any) => {
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
          const response = await axios.post(
            'https://cd2g26sz16.execute-api.ap-northeast-1.amazonaws.com/api/upload',
            base64data,
            {
              headers: {
                'X-API-Key': 'Fc7lslJVkP6Xr9dbkolZcPICL91IIMA6txhPg5Aj',
                'Content-Type': 'text/plain',
              },
            }
          );

          setMessage(`File uploaded successfully: ${response.data}`);
        } catch (error: any) {
          setMessage(`Error uploading file: ${error.message}`);
        }
      } else {
        setMessage('Error reading file.');
      }
    };

    reader.onerror = () => {
      setMessage('Error reading file.');
    };
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
