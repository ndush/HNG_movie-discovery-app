import { useRef, useState } from "react";
import { useTmdb } from "../api";

// Pass `videos` when already loaded (movie page) to skip the extra request.
export default function TrailerButton({ movieId, videos, className = "btn" }) {
  const { data } = useTmdb(videos ? null : `/movie/${movieId}/videos`);
  const dialog = useRef(null);
  const [open, setOpen] = useState(false);
  const list = videos?.results ?? data?.results ?? [];
  const trailer = list.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    list.find((v) => v.site === "YouTube");
  if (!trailer) return null;

  return (
    <>
      <button className={className} onClick={() => { setOpen(true); dialog.current.showModal(); }}>
        ▶ Trailer
      </button>
      {/* The dialog has no padding, so a click whose target is the dialog itself hit the backdrop. */}
      <dialog ref={dialog} className="trailer" onClose={() => setOpen(false)}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}>
        {open && (
          <iframe src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`}
            title={trailer.name} allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
        )}
        <form method="dialog">
          <button className="icon-btn trailer-close" aria-label="Close trailer">✕</button>
        </form>
      </dialog>
    </>
  );
}
