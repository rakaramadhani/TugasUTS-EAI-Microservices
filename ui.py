import streamlit as st
import requests

# Function to call the Flask API
def fetch_data(api_endpoint, params=None):
    response = requests.get(api_endpoint, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return None

# Function to display "Informasi Pariwisata" page
def informasi_page():
    st.title('Informasi Pariwisata')
    # Calling the API to get all tourist attractions
    api_endpoint = "http://127.0.0.1:5000/informasiwisata"
    data = fetch_data(api_endpoint)

    # Displaying data
    if data:
        st.write("---")
        for item in data:
            st.subheader(f"{item['acara_lokal']}")
            st.write(f"Location: {item['lokasi']}")
            st.write(f"Open Time: {item['open']}")
            st.write(f"Close Time: {item['close']}")
            st.write(f"Description: {item['deskripsi']}")
            st.image(item['image1'], caption=f"{item['acara_lokal']}")
            st.write("---")
    else:
        st.error('Failed to fetch data. Please try again.')

wisata = st.text_input("Enter tour name:")
if st.button("search"):
    # Fetching data for the specified tour name
    api_endpoint = f"http://localhost:5000/cariwisata?nama={wisata}"
    wisata_data = fetch_data(api_endpoint)

    # Displaying data if available
    if wisata_data:
        for item in wisata_data:
            st.subheader(f"{item['acara_lokal']}")
            st.write(f"Location: {item['lokasi']}")
            st.write(f"Open Time: {item['open']}")
            st.write(f"Close Time: {item['close']}")
            st.write(f"Description: {item['deskripsi']}")
            st.image(item['image1'], caption=f"{item['acara_lokal']}")
            st.write("---")
    else:
        st.error('No tourist attractions found for the specified name.')


# Main function to create the Streamlit UI
def main():
    informasi_page()

if __name__ == '__main__':
    main()