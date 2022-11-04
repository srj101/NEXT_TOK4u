// import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

// import rehypeSanitize from "rehype-sanitize";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

import { Editor } from "@tinymce/tinymce-react";

export default function ViewNoteBook() {
  const editorRef = useRef(null);

  const [value, setValue] = useState("Test");
  const [title, setTitle] = useState("Markdown Test");

  const router = useRouter();

  async function postMarkdown() {
    await fetch("/api/v1/note/create-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value,
        title,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        router.push(`/notebook/${res.id}`);
      });
  }

  return (
    <div className="">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          NoteBook Title
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Notebook title goes here..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
      </div>

      <div className="mt-4 h-full">
        <Editor
          apiKey={
            process.env.TINY_MCE_API_KEY ||
            "4affuybkwsnfzhv7ra9rmi2z380go3jzjjz92ooutbfzkmj1"
          }
          onInit={(evt, editor) => (editorRef.current = editor)}
          value={value || ""}
          onEditorChange={setValue}
          init={{
            theme_advanced_buttons3_add: "preview",
            plugin_preview_width: "500",
            plugin_preview_height: "600",
            height: 500,
            menubar: true,
            selector: "textarea",
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              "textpattern",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help" +
              "preview",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />

        <div className="mt-4 float-right">
          <button
            onClick={() => postMarkdown()}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
