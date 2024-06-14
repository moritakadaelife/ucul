import { Inter as FontSans } from "next/font/google"

import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <div className="ucul">
        <Header />
        <main className="ucul-main">
          <section className="ucul-section__upload-file">
            <h2 className="ucul-section__upload-file-title">検閲データ</h2>
            {/* <Label className="ucul-section__upload-file-label">
              <Input id="picture" type="file" accept=".csv" multiple className="ucul-section__upload-file-input" onChange={handleFileUpload}></Input>
            </Label> */}
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
                <tr>
                  <td>
                    <div className="ucul-section__lists-table-cell-aligner">
                      <span>test.csv</span>
                      <button>Delete</button>
                    </div>
                  </td>
                  <td>
                    <div className="ucul-section__lists-table-cell-aligner">
                      <span>test.csv</span>
                      <button>Download</button>
                      <button>Delete</button>
                    </div>
                  </td>
                </tr>
                {/* {files.map((file, index) => (
                  <tr key={index}>
                    <td>
                      <div className="ucul-section__lists-table-cell-aligner">
                        <span>{file.name}</span>
                        <Button onClick={() => handleDeleteFile(file.name)}>Delete</Button>
                      </div>
                    </td>
                    <td>
                      <div className="ucul-section__lists-table-cell-aligner">
                        <span>{file.name}</span>
                        {file.status === 'completed' ? (
                          <>
                            <Button as="a" href={file.downloadLink} download={file.name}>
                              Download
                            </Button>
                          </>
                        ) : (
                          <Button disabled>Download</Button>
                        )}
                        <Button onClick={() => handleDeleteFile(file.name)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
