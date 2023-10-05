import { useState, useEffect } from 'react'

import { Card, FormField, Loader } from '../components';

const RenderCards = ({ data, title }) => {
    if (data?.length > 0) {
        return data.map((post) => <Card key={post._id} {...post} />)
    }

    return (
        <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
    )
}

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [allPosts, setAllPosts] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [searchedResults, setSearchedResults] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            try {
                const response = await fetch('http://localhost:3000/api/v1/post', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();

                    setAllPosts(result.data.reverse());
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);

        setSearchText(e.target.value);

        setSearchTimeout(
            setTimeout(() => {
                const searchResults = allPosts.filter((post) => post.prompt.toLowerCase().includes(searchText.toLowerCase()));

                setSearchedResults(searchResults);
            }, 500)
        );
    };

    return (
        <section className="max-w-5xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">The Community Showcase</h1>
                <p className="mt-2 text-[#666e75] text-[16px] max-w-3xl">Browse through a collection of imaginative and visually stunning images, posted by our community and generated using DALL-E model by OpenAI</p>
            </div>

            <div className="mt-16 max-w-3xl">
                <FormField
                    LabelName="Search posts"
                    type="text"
                    name="search"
                    placeholder="Search here..."
                    value={searchText}
                    handleChange={handleSearchChange}
                />
            </div>

            <div className="mt-10">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <h2 className="font-medium text-[#666e75] text-xl mb-3">
                                Showing results for <span className="text-[#222328]">{searchText}</span>
                            </h2>
                        )}

                        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                            {searchText ? (
                                <RenderCards
                                    data={searchedResults}
                                    title="No search results found"
                                />
                            ) : (
                                <RenderCards
                                    data={allPosts}
                                    title="No posts found"
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default Home