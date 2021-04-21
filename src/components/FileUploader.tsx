import React, { useState } from 'react';


interface FileUploaderProps {
    handleUploadConfig: (file: File) => void;
    handleDownloadCurrentClick: () => void;
    handleDownloadOriginalClick: () => void;
}

function FileUploader(props: FileUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File>();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) setSelectedFile(e.target.files[0]);
    }

    return (
    <div >   
            <div style={{display: "flex"}}>
                {/* <button onClick={props.handleDownloadCurrentClick} style={{ display: "inline"}}>Download Current Network</button> */}
                <button onClick={props.handleDownloadOriginalClick} style={{ display: "inline"}}>Download Untrained Network</button>
            </div>
            <input type="file" onChange={handleFileChange} style={{ display: "block" ,maxWidth: "min-content"}}/>
            <button onClick={() => selectedFile && props.handleUploadConfig(selectedFile)}>Import Network</button>
    </div>
    );
}

export default FileUploader;