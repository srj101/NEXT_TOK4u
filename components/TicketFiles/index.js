import React, { useState, useEffect } from "react";
import fileDownload from "js-file-download";
import axios from "axios";
import { TrashIcon, DocumentDownloadIcon } from "@heroicons/react/solid";

export default function TicketFiles({ id, uploaded, setUploaded }) {
  const [files, setFiles] = useState([]);

  async function getFiles() {
    await fetch(`/api/v1/ticket/${id}/file/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("from ticketfiles ", res);
        setFiles(res.files);
        setUploaded(false);
      });
  }

  async function deleteFile(file) {
    await fetch(`/api/v1/ticket/${id}/file/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: file.id,
        path: file.path,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        getFiles();
      });
  }

  console.log(uploaded);

  function download(file) {
    const url = `/api/v1/ticket/${id}/file/download?filepath=${file.path}`;
    let data = new FormData();
    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, file.filename);
      });
  }

  useEffect(() => {
    getFiles();
  }, [uploaded]);

  return (
    <div>
      <h3 className="text-xl">Ticket Files</h3>
      <div className="flow-root py-4 mx-auto -mt-5">
        {files?.length >= 1 ? (
          files.map((file) => {
            return (
              <div className="w-full" key={file.id}>
                <ul>
                  {(file.path.split("/")[4].split(".")[1] === "jpg" ||
                    file.path.split("/")[4].split(".")[1] === "png" ||
                    file.path.split("/")[4].split(".")[1] === "jpeg") && (
                    <li>
                      <span>
                        {" "}
                        <img
                          width="60"
                          height="60"
                          src={`/storage/${file.path.split("./storage")[1]}`}
                        />{" "}
                      </span>
                      <button
                        onClick={() => download(file)}
                        type="button"
                        className="border border-transparent rounded-full shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <DocumentDownloadIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        onClick={() => deleteFile(file)}
                        type="button"
                        className="mr-1  border border-transparent rounded-full shadow-sm text-red-600 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </li>
                  )}

                  {file.youtubeUrl && (
                    <li>
                      <span>
                        {" "}
                        <a
                          href={file.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            title="youtube video- click to open"
                            width="60"
                            height="60"
                            src={file.thumbnail}
                          />
                        </a>{" "}
                      </span>
                      <button
                        onClick={() => download(file)}
                        type="button"
                        className="border border-transparent rounded-full shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <DocumentDownloadIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            );
          })
        ) : (
          <p>No files attached to the job ... </p>
        )}
      </div>
    </div>
  );
}
