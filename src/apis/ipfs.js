import { create } from "ipfs-http-client";

const projectId = '2RZLPSvvOzEhhGhLrEE3X5bQHqA';   // <---------- your Infura Project ID

const projectSecret = '821c251a852ffa9f71e9c9b2864ed8da';  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

let ipfs;
try {
    ipfs = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        },
    });
} catch (error) {
    console.error("IPFS error ", error);
    ipfs = undefined;
}

export async function uploadFilesToIPFS(fileList) {
    if (!ipfs) {
        return console.error('IPFS service can\'t be conencted :(');
    }
    let files = fileList.map ? fileList : Array.from(fileList);
    const compatibleFileList = files.map(file => new File([file], file.name, { type: file.type }));

    console.log("Provided files:", files);
    console.log("Files without path property:", compatibleFileList);

    const results = await Promise.all(compatibleFileList.map(ipfs.add));
    compatibleFileList.forEach((file, idx) => results[idx].name = file.name || "file")
    console.log("IPFS upload results", results);
    return results;
}


// // Using web3.storage
// import { Web3Storage } from 'web3.storage'

// const IPFS_TOKEN = process.env.REACT_APP_IPFS_TOKEN || null;

// const ipfsStorage = new Web3Storage({ IPFS_TOKEN });

// export async function uploadFilesToIPFS(files) {
//   if (!IPFS_TOKEN) {
//     return console.error('A token is needed. You can create one on https://web3.storage')
//   }

//   console.log(`Uploading ${files.length} files`)
//   const cid = await ipfsStorage.put(files)
//   console.log('Content added with CID:', cid)
//   return cid;
// }