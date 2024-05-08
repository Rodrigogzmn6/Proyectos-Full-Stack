import csvToJson from 'convert-csv-to-json'
import cors from 'cors'
import express from 'express'
import multer from 'multer'

const app = express()
const port = 3000
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

let userData: Array<Record<string, string>> = []

app.use(cors()) //Enable CORS

app.post('/api/files', upload.single('file'), async (req, res) => {
  // 1. Extract file from request
  const { file } = req

  // 2. Validate that we have file
  if (!file) return res.status(500).json({ message: 'File is required.' })

  // 3. Validate the mimetype (csv)
  if (file.mimetype !== 'text/csv')
    return res.status(500).json({ message: 'File must be CSV.' })

  let json: Array<Record<string, string>> = []
  try {
    // 4. Transform the file (Buffer) to string
    const rawCsv = Buffer.from(file.buffer).toString('utf-8')

    // 5. Transform string CSV to JSON
    json = csvToJson.fieldDelimiter(',').csvStringToJson(rawCsv)
  } catch (error) {
    return res.status(500).json({
      message: 'Error parsing file.'
    })
  }

  // 6. Save JSON to memory
  userData = json

  // 7. Return 200 with message and JSON
  return res.status(200).json({
    data: json,
    message: 'File uploaded correctly.'
  })
})

app.get('/api/users', async (req, res) => {
  // 1. Extract the query param 'q' from the request
  const { q } = req.query

  // 2. Validate that we have query param
  if (!q) return res.status(500).json({ message: 'No query param found.' })
  if (Array.isArray(q))
    return res.status(500).json({ message: 'Query param must be a string.' })

  // TODO: 3. Filter the data from the memory with the query param
  const search = q.toString().toLowerCase()
  const filteredData = userData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toLowerCase().includes(search)
    )
  })

  // TODO: 4. Return 200 with filtered data
  return res.status(200).json({
    data: filteredData
  })
})

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
