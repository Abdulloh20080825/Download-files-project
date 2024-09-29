import { useState } from 'react';

export default function App() {
	const [files, setFiles] = useState({});

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();

		const fileType = file.type;

		if (fileType.startsWith('image/')) {
			reader.readAsDataURL(file);
		} else {
			reader.readAsText(file);
		}

		reader.onload = () => {
			setFiles({
				fileContent: reader.result,
				fileName: file.name,
				fileSize: file.size,
				fileType,
			});
		};
		reader.onerror = () => {
			console.error('Error reading file');
		};
	};
	const handleDownload = () => {
		const blob = new Blob([files.fileContent], { type: files.fileType });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = files.fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<div>
			<input type='file' onChange={handleFileChange} />
			{files.fileName && (
				<div>
					<h3>File Name: {files.fileName}</h3>
					<p>File Size: {files.fileSize} bytes</p>
					{files.fileType.startsWith('image/') ? (
						<img
							src={files.fileContent}
							alt={files.fileName}
							className='max-w-full h-auto mt-4'
						/>
					) : (
						<pre>{files.fileContent}</pre>
					)}
					<button
						onClick={handleDownload}
						className='bg-blue-500 text-white px-4 py-2 rounded mt-4'
					>
						Download File
					</button>
				</div>
			)}
		</div>
	);
}
