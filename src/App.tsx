import React, {useEffect, useState} from 'react';
import axios from 'axios';

import './App.css';

interface PhotosInterface {
    albumId: number,
    id: number,
    title: string,
    url: string,
    thumbnailUrl: string
}

const App: React.FC = (): React.ReactElement => {
    const [photos, setPhotos] = useState<PhotosInterface[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [fetching, setFetching] = useState<boolean>(true)
    const [totalCount, setTotalCount] = useState<number>(0)

    useEffect(() => {
        if (fetching) {
            axios.get(`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage}`).then((response) => {
                setPhotos([...photos, ...response.data])
                setCurrentPage(prevState => prevState + 1)
                setTotalCount(response.headers['x-total-count'])
            }).finally(() => setFetching(false))
        }
    }, [fetching])

    useEffect(() => {
        // @ts-ignore
        document.addEventListener('scroll', scrollHandler)

        return function () {
            // @ts-ignore
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    const scrollHandler = (e: any) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100 && photos.length < totalCount) {
            setFetching(true)
        }

    }

    return (
        <div className={'app'}>
            {
                photos && photos.map((photo) => {
                    return (
                        <div key={photo.id} className={'photo'}>
                            <div className={'title'}>{photo.id}. {photo.title}</div>
                            <img src={photo.thumbnailUrl} alt={photo.title}/>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default App;