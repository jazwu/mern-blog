import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className="max-w-3xl min-h-screen p-3 mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between sm:flex-row">
          <TextInput type="text" placeholder="Title" className="flex-1" required/>
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="web-dev">Web Development</option>
            <option value="mental-health">Mental Health</option>
            <option value="life-kit">Life Kit</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-gray-500 border-dotted p-4">
          <FileInput type="file" accept="image/*" />
          <Button gradientDuoTone="purpleToPink" size="sm" outline>Upload Image</Button>
        </div>
        <ReactQuill className="mt-5 h-72 mb-12"theme="snow" placeholder="Write something..." required/>
        <Button type="submit" gradientDuoTone="purpleToPink">Publish</Button>
      </form>
    </div>
  );
}
