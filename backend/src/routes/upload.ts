import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { FastifyInstance } from 'fastify'

// util to use to save file
const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    // to upload file with file size rule
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mb
      },
    })

    // validate if you have a file
    if (!upload) {
      return reply.status(400).send()
    }

    // mimetype rules (format file rules)
    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/

    // mimetype validation (format file validation)
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)
    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    // generate id and get original file extension
    const fileId = randomUUID()
    const extension = extname(upload.filename)

    // filename concat with extension
    const fileName = fileId.concat(extension)

    // create file url
    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    // save file
    // if you need, you can use other services to save the files, like "Amazon S3, Google GCS, Cloudflare R2"
    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', fileName),
    )
    await pump(upload.file, writeStream)

    return { fileUrl }
  })
}
