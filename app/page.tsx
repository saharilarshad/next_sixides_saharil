'use client'

import GenresRating from "@/components/genresRating/GenresRating";
import ListPagination from "@/components/listPagination/ListPagination";
import Loading from "@/components/loading/Loading";
import { TFilterAttributes, TSortingAttributes } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const modalRef = useRef()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [typeData, setTypeData] = useState<string>('now_playing')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [page, setPage] = useState<number>(1)
  const [sort, setSort] = useState(false)
  const [filter, setFilter] = useState(false)
  const [filterAtt, setFilterAtt] = useState<TFilterAttributes>({
    genresId: 0,
    rate: 0
  })

  const [sorting, setSorting] = useState<string>('')
  const [openModal, setOpenModal] = useState(false)
  const [movieId, setMovieId] = useState<number>(0)


  const { isPending: allMoviesIsPending, isError: allMoviesIsError, data: allMovies } = useQuery({
    queryKey: ['allMovies', filterAtt.genresId, filterAtt.rate, currentPage, sorting],
    queryFn: async () => {

      const response1 = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMBD_ACCESS_TOKEN}`
        },
        params: {
          include_adult: false,
          include_video: false,
          language: 'en-US',
          page: currentPage.toString(),
          sort_by: sorting ? sorting : 'popularity.desc',
          with_genres: filterAtt.genresId !== 0 ? [filterAtt.genresId.toString()] : undefined,
          'vote_average.lte': filterAtt.rate !== 0 ? filterAtt.rate : undefined
        }
      });

      const response2 = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMBD_ACCESS_TOKEN}`
        },
        params: {
          include_adult: false,
          include_video: false,
          language: 'en-US',
          page: (currentPage + 1).toString(),
          sort_by: sorting ? sorting : 'popularity.desc',
          with_genres: filterAtt.genresId !== 0 ? [filterAtt.genresId.toString()] : undefined,
          'vote_average.lte': filterAtt.rate !== 0 ? filterAtt.rate : undefined
        }
      });

      const combinedRes = [...response1.data.results, ...response2.data.results];

      // console.log('combinedRes', combinedRes);
      const totalResults = response1.data.total_results

      return { results: combinedRes, totalResults }

    }
  })

  const { isPending, isError, data } = useQuery({
    queryKey: ['nowPlaying', typeData, currentPage],
    queryFn: async () => {

      const response1 = await axios.get(`https://api.themoviedb.org/3/movie/${typeData}?language=en-US&page=${currentPage.toString()}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMBD_ACCESS_TOKEN}`
        }
      })

      const response2 = await axios.get(`https://api.themoviedb.org/3/movie/${typeData}?language=en-US&page=${(currentPage + 1).toString()}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMBD_ACCESS_TOKEN}`
        }
      })

      // console.log('response1', response1)
      // console.log('response2', response2)

      const combinedRes = [...response1.data.results, ...response2.data.results];

      // console.log('combinedRes', combinedRes);
      const totalResults = response1.data.total_results


      return { results: combinedRes, totalResults }
    }
  })

  const { isPending: getCastIsPending, isError: getCastIsError, data: getCast } = useQuery({
    queryKey: ['listCast', movieId],
    queryFn: async () => {

      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMBD_ACCESS_TOKEN}`
        }
      })

      return response.data
    }
  })

  useEffect(() => {
    queryClient.invalidateQueries(['allMovies', filterAtt.genresId, filterAtt.rate, sorting]);
    // window.scrollTo({ top: 0, behavior: 'smooth' })

  }, [filterAtt.genresId, queryClient, filterAtt.rate, sorting]);

  useEffect(() => {
    queryClient.invalidateQueries(['nowPlaying', typeData]);
    window.scrollTo({ top: 0, behavior: 'smooth' })

  }, [currentPage, queryClient]);

  useEffect(() => {
    queryClient.invalidateQueries(['listCast', movieId]);

  }, [movieId, queryClient]);


  const totalData = Array.from({ length: allMovies?.totalResults ? allMovies.totalResults : data?.totalResults }, (_, index) => index + 1)
  // console.log('totalData', totalData)

  const totalPages = allMovies?.results ? Math.ceil(totalData.length / 30) : data?.results ? Math.ceil(totalData.length / 30) : 0
  // console.log('totalPages', totalPages)

  const pageSize = 30
  const pageStart = (page - 1) * pageSize
  const endPage = pageStart + pageSize

  const uniqueMovies = allMovies?.results ? allMovies?.results.filter(mv => mv.backdrop_path !== "/acpFrSmVLnTNAIuHxnZArkC3dwU.jpg") : data?.results?.filter(mv => mv.backdrop_path !== "/acpFrSmVLnTNAIuHxnZArkC3dwU.jpg")
  // console.log('uniqueMovies', uniqueMovies)

  const paginationMovies = uniqueMovies?.slice(pageStart, endPage)
  // console.log('paginationMovies', paginationMovies)

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSorting(e.target.value)
  };

  const getMovie = useMemo(() => {
    const movie = paginationMovies?.find(mv => mv.id === movieId)
    return movie
  }, [movieId, paginationMovies])

  useEffect(() => {
    const handleRemoveModal = (e: any) => {

      if (openModal && modalRef.current && (modalRef.current as HTMLElement).contains(e.target as Node)) {
        setOpenModal(true)
      } else if (openModal && modalRef.current && !(modalRef.current as HTMLElement).contains(e.target)) {
        setOpenModal(false)
      }

    }

    if (openModal) {
      document.addEventListener('click', handleRemoveModal)
      // console.log("clicked");
    }

    return () => {
      document.removeEventListener('click', handleRemoveModal)

    }
  }, [openModal])

  const handleRefresh = () => {
    window.location.reload()
  }

  // console.log('data', data)
  // console.log('allMovies', allMovies)
  // console.log('filterAtt1', filterAtt.genresId)
  // console.log('filterAtt2', filterAtt.rate)
  // console.log('sorting', sorting)
  // console.log('allSorting', allSorting)
  // console.log('movieId', movieId);
  // console.log('getMovie', getMovie);
  // console.log('getCast', getCast);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between bg-slate-200 overflow-x-hidden">
      <header className="bg-gradient-to-l from-gray-700 via-gray-900 to-black text-white text-center py-5 flex items-center w-screen">
        <div className="p-5 flex items-center justify-between w-full xs:flex-col sm:flex-row md:flex-row lg:flex-row">
          <h1 className="text-2xl font-semibold cursor-pointer" onClick={handleRefresh}>SIXiDES Movies</h1>
          <div className="flex items-center justify-center gap-4 xs:flex-col sm:flex-row md:flex-row lg:flex-row">

            <div className="flex flex-col items-center">
              <h1 className="cursor-pointer" onClick={() => setFilter(!filter)}>Filters</h1>

              {filter &&
                <div className="flex items-center w-full gap-1 mt-2">
                  <GenresRating setFilterAtt={setFilterAtt} />
                </div>
              }
            </div>

            <div className="flex flex-col items-center">
              <h1 className="cursor-pointer" onClick={() => setSort(!sort)}>Sorting</h1>

              {sort &&
                <div className="flex items-center w-full gap-1 mt-2">
                  <select name="" id="" className="p-3 rounded-md text-slate-800"
                    value={sorting}
                    onChange={handleSortChange}
                  >
                    <option value="">Sort Types</option>
                    <option value="title.asc">Movies A - Z</option>
                    <option value="title.desc">Movies Z - A</option>
                    <option value="primary_release_date.asc">Old - Latest</option>
                    <option value="primary_release_date.desc">Latest - Old</option>
                    <option value="popularity.asc">Unpopular - Most Popular</option>
                    <option value="popularity.desc">Most Popular - Unpopular</option>
                    <option value="vote_average.asc">Low Rate - High Rate</option>
                    <option value="vote_average.desc">High - Low Rate</option>
                  </select>

                </div>
              }
            </div>

          </div>
        </div>
      </header>

      {(isPending && !allMoviesIsPending) && <Loading />}
      {(!isPending && allMoviesIsPending) && <Loading />}

      {(!isPending && !allMoviesIsPending) &&
        <section className="flex flex-wrap p-3 gap-5 justify-center h-full w-full mt-10">
          {paginationMovies && paginationMovies?.map((movie, index) => (
            <div key={movie.id} className="w-[15rem] h-[17rem] rounded-md items-center bg-gradient-to-l from-gray-700 via-gray-900 to-black cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => {
                setOpenModal(true)
                setMovieId(movie.id)
              }
              }
            >
              {/* <Link href={`movie/${movie.id}`}> */}
              <div className="flex flex-col p-1 gap-2">
                <div className="w-full h-[11rem] flex">
                  <Image src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`} height={100} width={250} alt={movie?.backdrop_path ? movie?.backdrop_path : movie?.poster_path} className="rounded-lg" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="flex items-center justify-center text-lg text-white">{movie.title}</h2>
                  {/* <span className="flex items-center justify-center text-md text-slate-300">{movie.release_date}</span> */}
                  <span className="flex items-center justify-center text-md text-slate-300">{new Date(movie.release_date).toLocaleDateString()}</span>
                </div>
              </div>
              {/* </Link> */}
            </div>
          ))}
        </section>
      }

      {openModal &&
        <div className="absolute bg-[#42414d] bg-opacity-60 justify-center mx-auto top-0 bottom-0 left-0 right-0 h-full w-full">

          <div ref={modalRef} className="h-[35rem] w-[55rem] bg-gradient-to-l from-gray-700 via-gray-900 to-black flex items-center mx-auto mt-28 overflow-y-auto">
            <div className="flex flex-col gap-4 items-center justify-center mx-auto">

              <h1 className="text-white text-4xl font-bold">{getMovie?.title}</h1>
              <div className="w-[48rem] h-[23rem] flex items-center justify-center mx-auto bg-red-500">
                <Image src={`https://image.tmdb.org/t/p/w500${getMovie?.poster_path}`} height={150} width={150} alt={getMovie?.title} className="w-full h-full p-2 rounded-lg" />
              </div>
              <span className="text-white text-lg">{new Date(getMovie?.release_date).toLocaleDateString()}</span>
              <div className="p-2 mx-4">
                {getCast && getCast?.cast.slice(0, 7).map(ct => (
                  <span key={ct.cast_id} className="text-slate-100">
                    {ct.name + ", "}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>
      }

      <>
        <ListPagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </>

    </main>
  );
}
