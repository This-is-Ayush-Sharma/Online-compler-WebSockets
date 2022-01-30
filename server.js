const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const javacmp = require('./compiler-cd/javacompiler');
const pythoncmp = require('./compiler-cd/pycompiler');
const ccmp = require('./compiler-cd/ccompiler');
const cppcmp = require('./compiler-cd/cppcompiler');
const port = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});


let codeCompilerQueue = [];

io.on("connection", (socket) => {


    socket.on("Compiler", (payload) => {
        socket.join(socket.id);
        codeCompilerQueue.push(payload);
        io.to(payload.socketId).emit("Compiler", {
            output: "Entered Queue You will have to Wait..."
        });
        const generate = async () => {
            let obj;
            let compileData;
            // console.log(compileData);
            // console.log(payload.socketId);
            while (codeCompilerQueue.length !== 0) {
                compileData = codeCompilerQueue.shift();
                if (compileData.extention === "py")
                    obj = await pythoncmp.run(compileData);
                else if (compileData.extention === "java")
                    obj = await javacmp.run(compileData);
                else if (compileData.extention === "c")
                    obj = await ccmp.run(compileData);
                else if (compileData.extention === "cpp")
                    obj = await cppcmp.run(compileData);
                io.to(obj.socketId).emit("Compiler", obj);
            }
        }
        generate();
    })
    socket.on("disconnect", () => {
        if (codeCompilerQueue) {
            codeCompilerQueue.map(function (element, index, array) {
                if (element.socketId === socket.id) {
                    let itemsCopy = [...codeCompilerQueue];
                    itemsCopy.splice(index, 1);
                    codeCompilerQueue = [...itemsCopy]
                }
            })
        }
    });
});

httpServer.listen(port, () => console.log(`Connected to port ${port}`));