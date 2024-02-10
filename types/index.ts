export type WrapAppType = {
    children: React.ReactNode,
}

export type TGenres = {
    id: number
    name: string
}

export type TFilterAttributes = {
    genresId: number
    rate: number
}

export type TSortingAttributes = {
    title: string
    releaseDate?: Date
    popularity: number
    rating: number
}