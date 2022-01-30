var fs = require('fs').promises;
// const { exec } = require("child_process");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var code;
var dataerror;
const getname = () =>{
    var w2="",w3="";
    var i;
    w2=code.replace(/\s+/g, ' ').trim();
    // console.log(w2.indexOf("class"));
    for(i=w2.indexOf("class")+6;i<w2.length;i++)
    {
        if(w2.charAt(i)!=' ' && w2.charAt(i)!='{')
        w3=w3+w2.charAt(i);
        else
        break;
    }
    // console.log(w3);
    w3=w3.trim();
    return w3;
};

const deletefiles = async (filenm) =>{ 
    // var filename=filenm+"error.txt";
    // const dataerror = await fs.readFile(filename,"binary");
    await fs.unlink(`${filenm+".java"}`);
    await fs.unlink(`${filenm+"input.txt"}`);
    await fs.unlink(`${filenm+"error.txt"}`);
    if (dataerror.length === 0){
    // await exec(`del ${filenm+".exe"}`);
    await fs.unlink(`${filenm+".class"}`);
    await fs.unlink(`${filenm+"output.txt"}`);}
}
const showoutput = async (filenm) =>{
    var filenms=filenm+"output.txt";
    filenm=filenm+"error.txt";
    // console.log(filenm);
    // const dataerror = await fs.readFile(filenm,"binary");
    // console.log(dataerror);
    
    // console.log(dataerror.length);
        if (dataerror.length === 0){
            const data = await fs.readFile(filenms,"binary");
            // console.log(data);
            return data;
        } else {
            // const datas = await fs.readFile(filenm,'base64');
            // console.log(datas);
            // console.log(dataerror);
            return dataerror;
        }
}

const getoutput = async(filenm) =>{
    // console.log("output gen");
    var command2 = `java ${filenm} < ${filenm+"input.txt"} > ${filenm+"output.txt"}`;
    filenm=filenm + "error.txt";
    dataerror = await fs.readFile(filenm,"binary");
    // console.log(dataerror);
    if (dataerror.length === 0)
    await exec(command2);
};
const compile = async (filenm) => {
    var command1 = `javac ${filenm+".java"} 2> ${filenm+"error.txt"}`;
    await exec(command1).catch(e => { console.log() });
    // console.log("compiles");
    // console.log(command1+" "+command2);
};

const savefile = async (filenm,inpnm) =>{
    var filename = filenm+".java";
    var fileinput = filenm + "input.txt"
    await fs.appendFile(filename, code);
    //createing input file.
    await fs.appendFile(fileinput, inpnm);      
}

const run = async (object) =>{
    code=object.code;
    // console.log(code);
    var filename=getname();
    // var filename='HelloWorld';
    savefile(filename,object.input);
    await compile(filename);
    await getoutput(filename);
    const k=await showoutput(filename);
    // const k="ayush";
    // const obj = {
    //     "output" : k
    // }
    // console.log(k);
    object.output=k
    await deletefiles(filename);
    return object;
};
module.exports = {run};