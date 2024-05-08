import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import './App.css'
import { uploadFile } from './services/upload'
import { Search } from './steps/Search'
import { type Data } from './types'

const APP_STATUS = {
  IDLE: 'idle',
  ERROR: 'error',
  FILE_SELECTED: 'file_selected',
  UPLOADING: 'uploading',
  FILE_UPLOADED: 'file_uploaded'
}

type APP_STATUS_TYPE = (typeof APP_STATUS)[keyof typeof APP_STATUS]

const BUTTON_TEXT = {
  [APP_STATUS.FILE_SELECTED]: 'Upload file.',
  [APP_STATUS.UPLOADING]: 'Uploading...'
}

function App() {
  const [appStatus, setAppStatus] = useState<APP_STATUS_TYPE>(APP_STATUS.IDLE)
  const [data, setData] = useState<Data>([])
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? []

    if (file !== null) {
      setFile(file)
      setAppStatus(APP_STATUS.FILE_SELECTED)
    }
    console.log(file)
  }

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (appStatus !== APP_STATUS.FILE_SELECTED || file === null) return

    setAppStatus(APP_STATUS.UPLOADING)

    const [err, data] = await uploadFile(file)

    if (err !== undefined) {
      setAppStatus(APP_STATUS.ERROR)
      toast.error(err.message)
    }

    setAppStatus(APP_STATUS.FILE_UPLOADED)
    if (data !== undefined) {
      console.log(data)
      setData(data)
    }
    toast.success('File uploaded succesfully.')
  }

  const showButton =
    appStatus === APP_STATUS.FILE_SELECTED || appStatus === APP_STATUS.UPLOADING
  const showForm = appStatus !== APP_STATUS.FILE_UPLOADED

  return (
    <>
      <Toaster />
      <h4>Challenge: Upload CSV + Search</h4>
      <div>
        {showForm && (
          <form onSubmit={handleOnSubmit}>
            <label>
              <input
                disabled={appStatus === APP_STATUS.UPLOADING}
                onChange={handleInputChange}
                name='file'
                type='file'
                accept='.csv'
              />
            </label>
            {showButton && (
              <button disabled={appStatus === APP_STATUS.UPLOADING}>
                {BUTTON_TEXT[appStatus]}
              </button>
            )}
          </form>
        )}

        {appStatus === APP_STATUS.FILE_UPLOADED && (
          <Search initialData={data} />
        )}
      </div>
    </>
  )
}

export default App
