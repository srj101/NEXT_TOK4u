/*
Developer worked on youtube API : Rakibul
web: https://github.com/Rakibul-Islam-GitHub
order: https://www.fiverr.com/rakibul_cse21
linkedin: https://www.linkedin.com/in/rakibul21
email: rakibulislam.cse21@gmail.com
*/


import React, { useState, useEffect, Fragment, useRef } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import dynamic from "next/dynamic";
import { Select, Form, Input, Radio, Space , message} from "antd";

// import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { Divider, List, Typography } from 'antd';

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function youtubeApiSettings() {
 
  const [pl, setPL] = useState('');
  const [clientid, setClientid] = useState('');
  const [clientsecret, setClientSecret] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [title, setTitle] = useState("");
  
  async function createYTsettings() {
    if (clientid==='' || clientsecret==='') {
      alert('Please enter a client ID & client secret')
      return
    }
   const res= await fetch("/api/v1/admin/socialsettings/youtube/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientid,
        clientsecret,
        privacy
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        message.success('Youtube api credentials updated successfully.');
        setClientid('')
        setClientSecret('')
        setPrivacy('')
        setPL('')
        setTitle('')
      }
    })
    .catch((err) => console.log(err))
    
  }

  const data = [
    
    
    
  ];
  return (
    <>
      <div>
        <div>
          <h1 className="text-xl text-center m2 p2 font-bold">
            Youtube API Settings
          </h1>
          <h6 className="text-xs font-normal text-gray-900">
            All fields are required!
          </h6>

          <div className="mt-4 space-y-4">
            <input
              type="text"
              id="name"
              placeholder="Enter Client ID
              here......"
              name="name"
              value={clientid}
              onChange={(e) => setClientid(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />

            <input
              type="text"
              name="email"
              value={clientsecret}
              placeholder="Enter Client secret here...."
              onChange={(e) => setClientSecret(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />

            <input
              type="text"
              name="title"
              placeholder="Channel Name"
              maxLength={64}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="title"
              placeholder="playlist"
              maxLength={64}
              value={pl}
              onChange={(e) => setPL(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />

            <div className="flex justify-center mx-auto">
              <Radio.Group
                buttonStyle="solid"
                onChange={(e) => setPrivacy(e.target.value)}
                className="mx-auto justify-center space-x-4"
              >
                <Radio.Button value="private">Private</Radio.Button>
                <Radio.Button value="public">public</Radio.Button>
                <Radio.Button value="linkonly" className="bg-red">
                  link for who get it
                </Radio.Button>
              </Radio.Group>
            </div>

            <div className="flex justify-center">
            <button
              onClick={createYTsettings}
              type="button"
              className="w-1/3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50 hover:bg-indigo-600"
            >
              Save Settings
            </button>
            </div>
            <>
    <Divider orientation="left">youtube api integration</Divider>
    <List

      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Typography.Text mark>[*]</Typography.Text> {item}
        </List.Item>
      )}
    />
    
  </>
            <MDEditor
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
              preview="edit"
            />
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense mx-auto ">
            <button
              onClick={() => {
                setOpen(false);
              }}
              type="button"
              className="w-1/2 mx-auto  inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50 hover:bg-indigo-600 cursor-not-allowed"
            >
              Save
            </button>
            <button
              onClick={() => {
                setOpen(false);
              }}
              type="button"
              className="mt-3 w-1/2  mx-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
