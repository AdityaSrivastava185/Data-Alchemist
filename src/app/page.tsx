import Image from "next/image";

import Header from "@/components/Header";
import FileUploadCards from "@/components/FileUploadCards";

export default function Home() {
  return (
    <>
      <div>
       <Header/>
       <FileUploadCards/>
      </div>
    </>
  );
}
