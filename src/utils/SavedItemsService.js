import axios from "axios";
const apiUrl = process.env.REACT_APP_SERVER_URL;

export const fetchData = async (userId, setSavedItems) => {
    try {
        const response = await axios.get(`${apiUrl}/api/Item/ReadSavedItems/${userId}`);
        console.log(response.data);
        setSavedItems(response.data);
    } catch (error) {
        console.error('Error fetching saved items:', error);
        setSavedItems([]);
    }
};

export const isSavedItem = (refresh, item, savedItems) => {
    return refresh || savedItems.some(savedItem => savedItem.id === item.id);
};

export const updateSavedItemFunction = async (isSave, userId, item, changeSavedItems, refresh) => {
    const thisRatingNote = {
        ratingNoteId: 0,
        userId,
        itemId: item.id,
        rating: null,
        note: null,
        savedItem: isSave,
    }
    console.log(thisRatingNote);
    const response = await axios.put(`${apiUrl}/api/RatingNote/PutRatingNote/0`, thisRatingNote, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 200) {
        changeSavedItems();
        console.log('save item updated successfully');
        if (refresh && !isSave) {
            refresh(item.id);
        }
    } else {
        throw new Error('Failed to update rating & note');
    }
};