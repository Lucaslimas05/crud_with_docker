import { useState, useEffect, useCallback } from "react"

function useFetchData(fetchFunction) {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [params, setParams] = useState()

  const refreshData = useCallback(() => {
    setParams(undefined)
    setParams(params)
  }, [setParams, params])

  const clearData = useCallback(() => {
    setData(undefined)
  }, [setData])

  useEffect(() => {
    let didCancel = false;
    if (params) {
      const startFetch = async (params) => {
        setError(undefined)
        try {
          setLoading(true)
          let res = await fetchFunction(params)
          if (didCancel) return
          setData(res)
          setLoading(false)
        } catch (e) {
          if (e instanceof Error) {
            setError(e.message)
            setLoading(false)
          }
        }
      }
      startFetch(params)
    }
    return () => {
      didCancel = true;
    };
  }, [params, fetchFunction])

  return { loading, error, data, setParams, clearData, refreshData }
}
export default useFetchData