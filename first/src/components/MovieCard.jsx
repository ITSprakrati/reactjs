function MovieCard({ movie }) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";
  const hasRating = movie.imdbRating && movie.imdbRating !== "N/A";

  return (
    <div className="card">
      <div className="poster-wrap">
        {hasPoster ? (
          <img src={movie.Poster} alt={movie.Title} />
        ) : (
          <div className="no-poster">No Poster</div>
        )}
      </div>

      <div className="card-body">
        <p className="card-title" title={movie.Title}>
          {movie.Title}
        </p>
        <div className="card-meta">
          <span>{movie.Year}</span>
          {hasRating && <span className="card-rating">{movie.imdbRating} / 10</span>}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
