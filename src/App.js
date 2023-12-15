/* eslint-disable no-undef */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import { Form } from "react-bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const API_URL = "https://api.unsplash.com";
const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  const getImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        const { data } = await axios.get(
          `${API_URL}/search/photos/?query=${searchInput.current.value}&page=${currentPage}&per_page=24&client_id=${API_KEY}`
        );
        setImages([...images, ...data.results]);
        setTotalPages(data.total_pages);
      }
    } catch (error) {}
  }, [currentPage]);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      setImages([]);
      setCurrentPage(1);
      getImages();
    },
    [searchInput]
  );

  useEffect(() => {
    getImages();
  }, [getImages]);

  useEffect(() => {
    setImages([]);
  }, [handleSearch]);

  return (
    <div className="container">
      <h1 className="title">Images Search</h1>
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Search for images"
            className="search-input"
            ref={searchInput}
          />
        </Form>
      </div>
      <InfiniteScroll
        dataLength={images.length}
        next={() => setTimeout(() => setCurrentPage(currentPage + 1), 500)}
        hasMore={currentPage < totalPages}
        loader={
          <div className="loading">
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
          </div>
        }
      >
        <div className="images-section">
          {images.map((image) => (
            <div className="image">
              <img
                key={image.id}
                src={image.urls.regular}
                alt={image.alt_description}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default App;
