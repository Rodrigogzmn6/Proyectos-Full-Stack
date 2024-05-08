import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { searchData } from '../services/search'
import { type Data } from '../types'

const DEBOUNCE_TIME = 300

export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>(initialData)
  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get('q') ?? ''
  })
  const debouncedSearch = useDebounce(search, DEBOUNCE_TIME)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    // Add data to URL
    const newPathName =
      debouncedSearch === ''
        ? window.location.pathname
        : `?q=${debouncedSearch}`

    window.history.pushState({}, '', newPathName)
  }, [debouncedSearch])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!debouncedSearch) {
      setData(initialData)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    searchData(debouncedSearch).then((response) => {
      const [err, newData] = response
      if (err !== undefined) {
        toast.error(err.message)
      }
      if (newData !== undefined) setData(newData)
    })
  }, [debouncedSearch, initialData])

  return (
    <div>
      <h1>Search</h1>
      <form>
        <input
          type='search'
          placeholder='Search data...'
          onChange={handleSearch}
        />
      </form>
      <ul>
        {data.map((row) => (
          <li key={row.id}>
            <article>
              {Object.entries(row).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong>
                  {value}
                </p>
              ))}
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
