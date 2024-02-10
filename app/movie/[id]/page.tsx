import { useQuery } from "@tanstack/react-query"
import axios from "axios"

type Props = {
  params: {
    id: string
  }
}

const MovieDetail = ({ params }: Props) => {

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['getMovie', params.id],
    queryFn: async () => {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${params.id}?language=en-US`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMBD_ACCESS_TOKEN}`
        }
      })
      return res.data
    },
    cacheTime: 0
  })

  console.log(data)

  return (
    <div>MovieDetail</div>
  )
}

export default MovieDetail
