import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Recipe {
  title: string;
  ingredients: string;
  instructions: string;
  score: number;
  image_weight: number;
  text_weight?: number;
}

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [descriptionConfirmed, setDescriptionConfirmed] = useState(false);
  const [numRecipes, setNumRecipes] = useState(5);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    }
  });

  const handleSearch = async () => {
    if (!image && !descriptionConfirmed) {
      setError('Please upload an image or enter a description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      if (descriptionConfirmed) {
        formData.append('description', description);
      }
      formData.append('num_recipes', numRecipes.toString());

      const response = await axios.post('/api/search', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRecipes(response.data);
    } catch (err) {
      setError('Error searching for recipes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">MunchMatch</h1>
          <p className="text-xl text-gray-600">Find the perfect recipe for your food</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all hover:shadow-xl">
            <div className="space-y-8">
              {/* Image Upload */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <PhotoIcon className="h-6 w-6 mr-2 text-blue-500" />
                  Upload Food Image
                </h2>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                    ${isDragActive 
                      ? 'border-blue-500 bg-blue-50 scale-105' 
                      : 'border-gray-300 hover:border-gray-400 hover:scale-[1.02]'}`}
                >
                  <input {...getInputProps()} />
                  <PhotoIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg text-gray-600 mb-2">
                    {isDragActive
                      ? 'Drop the image here'
                      : 'Drag and drop an image, or click to select'}
                  </p>
                  <p className="text-sm text-gray-500">Supports: JPG, PNG</p>
                  {image && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        Selected: {image.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Input */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-500" />
                  Add Food Description
                </h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                  rows={4}
                  placeholder="Describe the food in detail (e.g., 'A rich, moist chocolate cake with a creamy ganache frosting')"
                />
                <button
                  onClick={() => setDescriptionConfirmed(true)}
                  disabled={!description || descriptionConfirmed}
                  className={`mt-4 w-full px-6 py-3 rounded-lg text-white font-medium transition-all duration-200
                    ${description && !descriptionConfirmed
                      ? 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
                      : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  {descriptionConfirmed ? 'Description Confirmed' : 'Confirm Description'}
                </button>
              </div>

              {/* Number of Recipes Slider */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <SparklesIcon className="h-6 w-6 mr-2 text-blue-500" />
                  Number of Recipes
                </h2>
                <div className="px-4">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={numRecipes}
                    onChange={(e) => setNumRecipes(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">1</span>
                    <span className="text-lg font-medium text-blue-600">{numRecipes}</span>
                    <span className="text-sm text-gray-500">12</span>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={loading || (!image && !descriptionConfirmed)}
                className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition-all duration-200
                  ${(image || descriptionConfirmed) && !loading
                    ? 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
                    : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  'Search Recipes'
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-600 text-center">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended Recipes</h2>
            {recipes.length > 0 ? (
              <div className="space-y-6">
                {recipes.map((recipe, index) => (
                  <div 
                    key={index} 
                    className="border rounded-xl p-6 transform transition-all hover:shadow-md hover:scale-[1.01]"
                  >
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="px-3 py-1 bg-blue-100 rounded-full">
                        <span className="text-sm font-medium text-blue-700">
                          Score: {recipe.score.toFixed(4)}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-green-100 rounded-full">
                        <span className="text-sm font-medium text-green-700">
                          Image: {recipe.image_weight}
                        </span>
                      </div>
                      {recipe.text_weight !== undefined && (
                        <div className="px-3 py-1 bg-purple-100 rounded-full">
                          <span className="text-sm font-medium text-purple-700">
                            Text: {recipe.text_weight.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Ingredients:</h4>
                      <p className="text-gray-600 whitespace-pre-line">{recipe.ingredients}</p>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Instructions:</h4>
                      <p className="text-gray-600 whitespace-pre-line">{recipe.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SparklesIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">
                  {loading ? 'Searching for recipes...' : 'No recipes found. Try searching!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 