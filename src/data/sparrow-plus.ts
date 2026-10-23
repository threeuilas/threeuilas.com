// Replace these assets when the new Sparrow+ photography is available.
export const sparrowPhotos = {
	front: { alt: 'Front view of the Sparrow+ electric utility tricycle.', caption: 'Front view' },
	'side-front': { alt: 'Sparrow+ electric utility tricycle parked beside tropical vegetation.', caption: 'Sparrow+' },
	side: { alt: 'Side view of the compact Sparrow+ electric utility tricycle with its 3 ft 6 in cargo bed.', caption: 'Compact utility' },
	rear: { alt: 'Rear view of the Sparrow+ steel cargo bed and tailgate.', caption: 'Steel cargo bed' },
	'rear-seat': { alt: 'Foldable rear seat inside the Sparrow+ cargo bed.', caption: 'Foldable rear seat' },
};

export type SparrowPhotoName = keyof typeof sparrowPhotos;
