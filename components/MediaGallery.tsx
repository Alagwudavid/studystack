
/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from "@emotion/react";

interface MediaItem {
  type: 'image' | 'video'
  url: string
  title?: string
}

interface MediaGalleryProps {
  media: MediaItem[]
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
  // Media item styles
  const mediaItemStyle = css`
    position: relative;
    // border-radius: 0.75rem;
    overflow: hidden;
    & img, & video {
    transition: all 0.3s ease;
    }
    & img:hover {
      transform: scale(1.02);
    }
  `;

  // Layout containers
  const singleMediaStyle = css`
    width: 100%;
    max-height: 400px;
  `;

  const dualMediaStyle = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    // gap: 0.5rem;
    width: 100%;
  `;

  const tripleMediaStyle = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    // gap: 0.5rem;
    width: 100%;
    height: 400px;
    
    & > :first-child {
      grid-row: 1 / -1;
    }
  `;

  const quadMediaStyle = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    // gap: 0.5rem;
    width: 100%;
    height: 400px;
  `;

  const multiMediaStyle = css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    // gap: 0.5rem;
    width: 100%;
    height: 400px;
    
    & > :first-child {
      grid-row: 1 / -1;
    }
    
    & > :nth-child(3) {
      position: relative;
    }
  `;

  const imageStyle = css`
    width: 100%;
    height: 100%;
    object-fit: cover;
  `;

  const videoStyle = css`
    width: 100%;
    height: 100%;
    object-fit: cover;
  `;

  const overlayStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    // border-radius: 0.75rem;
  `;

  const altTextStyle = css`
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    max-width: calc(100% - 1rem);
    word-break: break-word;
    pointer-events: none;
    z-index: 20;
  `;

  // Layout logic based on media count
  const getLayoutStyle = () => {
    switch (media.length) {
      case 1:
        return singleMediaStyle;
      case 2:
        return dualMediaStyle;
      case 3:
        return tripleMediaStyle;
      case 4:
        return quadMediaStyle;
      default:
        return multiMediaStyle;
    }
  };

  const renderMediaItem = (item: MediaItem, index: number) => (
    <div key={index} css={mediaItemStyle}>
      {item.type === 'image' ? (
        <img
          src={item.url}
          alt={item.title || 'Post media'}
          css={imageStyle}
          draggable={false}
        />
      ) : (
        <video
          src={item.url}
          css={videoStyle}
          controls
          muted
          preload="metadata"
        />
      )}
      {/* {item.title && (
        <div css={altTextStyle}>
          {item.title}
        </div>
      )} */}
      {/* Overlay for 5+ items on the last visible item */}
      {media.length > 4 && index === 2 && (
        <div css={overlayStyle}>
          +{media.length - 3}
        </div>
      )}
    </div>
  );

  if (!media || media.length === 0) return null;

  // For 5+ items, only show first 3 items with overlay on the third
  const itemsToShow = media.length > 4 ? media.slice(0, 3) : media;

  return (
    <div className="w-full max-w-full rounded-2xl overflow-hidden">
      <div css={getLayoutStyle()}>
        {itemsToShow.map((item, index) => renderMediaItem(item, index))}
      </div>
    </div>
  );
};
