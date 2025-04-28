import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">MunchMatch</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Input Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Food Image</h2>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <input {...getInputProps()} />
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {isDragActive
                      ? 'Drop the image here'
                      : 'Drag and drop an image, or click to select'}
                  </p>
                  {image && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {image.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Description Input */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Add Food Description</h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe the food in detail (e.g., 'A rich, moist chocolate cake with a creamy ganache frosting')"
                />
                <button
                  onClick={() => setDescriptionConfirmed(true)}
                  disabled={!description || descriptionConfirmed}
                  className={`mt-2 px-4 py-2 rounded-md text-white
                    ${description && !descriptionConfirmed
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  {descriptionConfirmed ? 'Description Confirmed' : 'Confirm Description'}
                </button>
              </div>

              {/* Number of Recipes Slider */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Number of Recipes to Recommend
                </h2>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={numRecipes}
                  onChange={(e) => setNumRecipes(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-center text-gray-600">{numRecipes} recipes</p>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={loading || (!image && !descriptionConfirmed)}
                className={`w-full py-3 px-4 rounded-md text-white font-medium
                  ${(image || descriptionConfirmed) && !loading
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {loading ? 'Searching...' : 'Search Recipes'}
              </button>

              {error && (
                <p className="text-red-500 text-center">{error}</p>
              )}
            </div>
          </div>

          {/* Right Column - Results Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recommended Recipes</h2>
            {recipes.length > 0 ? (
              <div className="space-y-6">
                {recipes.map((recipe, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Similarity Score: {recipe.score.toFixed(4)}</p>
                      <p>Image Weight: {recipe.image_weight}</p>
                      {recipe.text_weight !== undefined && (
                        <p>Text Weight: {recipe.text_weight.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">Ingredients:</h4>
                      <p className="text-gray-600">{recipe.ingredients}</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">Instructions:</h4>
                      <p className="text-gray-600">{recipe.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                {loading ? 'Searching for recipes...' : 'No recipes found. Try searching!'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 