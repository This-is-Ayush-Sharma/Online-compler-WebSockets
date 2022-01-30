var fs = require('fs').promises;
// const { exec } = require("child_process");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var code;
var dataerror;
const getname = () =>{
    var w="";
    for(var i=1;i<=8;i++)
    {
        w=w+String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1) + 65));
    }
    return w;
};

const deletefiles = async (filenm) =>{ 
    var filename=filenm+"error.txt";
    // const dataerror = await fs.readFile(filename,"binary");
    await fs.unlink(`${filenm+".cpp"}`);
    await fs.unlink(`${filenm+"input.txt"}`);
    await fs.unlink(`${filenm+"error.txt"}`);
    if (dataerror.length === 0){
    await exec(`del ${filenm+".exe"}`);
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
    var command2 = `./${filenm} < ${filenm+"input.txt"} > ${filenm+"output.txt"}`;
    filenm=filenm + "error.txt";
    dataerror = await fs.readFile(filenm,"binary");
    // console.log(dataerror);
    if (dataerror.length === 0)
    await exec(command2);
};
const compile = async (filenm) => {
    var command1 = `g++ ${filenm+".cpp"} -o ${filenm} 2> ${filenm+"error.txt"}`;
    await exec(command1).catch(e => { console.log() });
    // console.log("compiles");
    // console.log(command1+" "+command2);
};

const savefile = async (filenm,inpnm) =>{
    var filename = filenm+".cpp";
    var fileinput = filenm + "input.txt"
    await fs.appendFile(filename, code);
    //createing input file.
    await fs.appendFile(fileinput, inpnm);      
}

const run = async (object) =>{
    code = object.code;
    // console.log(code);
    var filename=getname();
    savefile(filename,object.input);
    await compile(filename);
    await getoutput(filename);
    const k=await showoutput(filename);
    object.output=k;
    // console.log(obj);
    deletefiles(filename);
    return object;
};
module.exports = {run};
