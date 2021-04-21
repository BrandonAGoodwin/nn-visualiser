import React, { useState } from 'react';


interface FileUploaderProps {
    handleUploadConfig: (file: File) => void;
    handleDownloadClick: () => void;
}

function FileUploader(props: FileUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File>();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) setSelectedFile(e.target.files[0]);
    }

    return (
    <div >   
            <button onClick={props.handleDownloadClick}>Download Network</button>
            <input type="file" onChange={handleFileChange} style={{ display: "block" ,maxWidth: "min-content"}}/>
            <button onClick={() => selectedFile && props.handleUploadConfig(selectedFile)}>Upload</button>
    </div>
    );
}

export default FileUploader;