const Config = require('./config')
const port = Config.PORT ?? 8081
const DB = Config.DATABASE_URL.replace(
    '<password>',
    Config.DATABASE_PASSWORD
)

const http = require('http')
const url = require('url')
const mongoose = require('mongoose')
mongoose
.connect(DB)
.then(()=>console.log('資料庫連線成功'))
.catch(()=>console.log('資料庫連接資訊錯誤'))

const Post = require('./models/post')
const errorHandler = require('./utils/errorHandler')
const successHandler = require('./utils/successHandler')
const validHandler = require('./utils/validHandler');

const requestListener = async(req, res) => {
    const parseURL = url.parse(req.url, true)
    const { pathname } = parseURL
    if (req.method === 'OPTIONS' || pathname === '/favicon.ico') {
        successHandler.success(res)

    } else if (pathname === '/') {
        errorHandler.noFound(res)

    } else if (pathname.includes('/posts')) {
        const splitURL = req.url.startsWith("/posts/")
        switch (req.method) {
            case 'GET':
                const posts = await Post.find();
                successHandler.success(res, posts)
                break;

            case 'POST':
                let body = ''
                req.on('data', chunk => {
                    body += chunk
                })
                req.on('end',async()=>{
                    try{
                        const data = JSON.parse(body)
                        // mongodb shell > insertOne
                        // mongoose > create
                        const nameIsValid = validHandler.isValidTitle(data.name);
                        const contentIsValid = validHandler.isValidTitle(data.content);
                        const newdata = {}
                        if(nameIsValid) newdata.name = data.name
                        if(contentIsValid) newdata.content = data.content
                        const newPost = await Post.create(newdata)
                        successHandler.createSuccess(res, newPost)
                    }catch(error){
                        errorHandler.errorMsg(res, error)
                    }
                })
                break;
                
            case 'PUT':
                if(splitURL){
                    let body = ''
                    req.on('data', chunk => {
                        body += chunk
                    })
                    req.on('end',async()=>{
                        try{
                            const id = req.url.split('/').pop().toString().trim()
                            const data = JSON.parse(body)

                            const nameIsValid = validHandler.isValidTitle(data.name);
                            const contentIsValid = validHandler.isValidTitle(data.content);
                            const newdata = {}
                            if(nameIsValid) newdata.name = data.name
                            if(contentIsValid) newdata.content = data.content

                            const updatePost = await Post.findByIdAndUpdate(id, newdata, {new: true})
                            if(updatePost){
                                successHandler.success(res, updatePost)
                            }else{
                                errorHandler.noFound(res)
                            }
                        }catch(error){
                            errorHandler.errorMsg(res, error)
                        }
                    })
                }else{
                    errorHandler.noFound(res)
                }
                break;

            case 'DELETE':
                // 刪除全部
                // const deleteAllPost = await Post.deleteMany()
                // successHandler.createSuccess(res)
                if(splitURL){
                    try {
                        const id = req.url.split('/').pop().toString().trim()
                        const targetDelete = await Post.findByIdAndDelete(id)
                        if(targetDelete){
                            successHandler.success(res, targetDelete)
                        }else{
                            errorHandler.noFound(res)
                        }
                    } catch (error) {
                        errorHandler.errorMsg(res, error)
                    }
                }else{
                    errorHandler.noFound(res)
                }
                break;

            default:
                break;
        }

    }else{
        errorHandler.noFound(res)
    }
}

const server = http.createServer(requestListener)
server.listen(port)