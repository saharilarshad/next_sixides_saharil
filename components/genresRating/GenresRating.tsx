import axios from "axios"
import Loading from "../loading/Loading"
import { useQuery } from "@tanstack/react-query"
import { ChangeEvent, useEffect, useState } from "react"
import { TFilterAttributes, TGenres } from "@/types"

const GenresRating = ({ setFilterAtt }: TFilterAttributes) => {
  const [selectedGenre, setSelectedGenre] = useState<number>(0)
  const [selectedRate, setSelectedRate] = useState<number>(0)

  const { isPending, isError, data } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {

      const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?language=en`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMBD_ACCESS_TOKEN}`
        }
      })
      return response.data
    }
  })

  // console.log("data", data)

  const handleGenreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value)
  };
  // console.log('selectedGenre', selectedGenre)

  const handleRateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRate(e.target.value)
  };
  // console.log('selectedRate', selectedRate)

  useEffect(() => {
    setFilterAtt({
      genresId: selectedGenre,
      rate: selectedRate
    });
  }, [selectedGenre, setFilterAtt, selectedRate]);

  return (
    <>
      {isPending ? (
        <Loading />
      ) : (
        <>
          <select className="p-3 rounded-md text-slate-800"
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            <option defaultValue={""}>Genres</option>
            {data && data?.genres.map((genre: TGenres) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          <select className="p-3 rounded-md text-slate-800"
            value={selectedRate}
            onChange={handleRateChange}
          >
            <option value="">Rating</option>
            <option value={2}> ≤ 2 ⭐</option>
            <option value={4}> ≤ 4 ⭐</option>
            <option value={6}> ≤ 6 ⭐</option>
            <option value={8}> ≤ 8 ⭐</option>
            <option value={10}> ≤ 10 ⭐</option>
          </select>
        </>
      )}
    </>
  )
}

export default GenresRating