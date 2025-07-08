import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cropSearchSchema, type CropSearch, type ProductMatchResponse } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, CheckCircle2, Zap, Shield } from "lucide-react";

const exampleCrops = [
  {
    name: "Tomato #124",
    variety: "Heritage variety",
    image: "https://pixabay.com/get/g2f489fd12a3a6f37f1cfbba223dc4300c4043d1e8b9384edb31bbda6172d1acc35439fd449f41141693ad37dd60390f1e5a2f9b6911b500fa11075977d817603_1280.jpg"
  },
  {
    name: "Lettuce #456",
    variety: "Organic variety",
    image: "https://images.unsplash.com/photo-1557844352-761f2565b576?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60"
  },
  {
    name: "Carrot #789",
    variety: "Rainbow variety",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60"
  }
];

export default function Home() {
  const [searchResult, setSearchResult] = useState<ProductMatchResponse | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const form = useForm<CropSearch>({
    resolver: zodResolver(cropSearchSchema),
    defaultValues: {
      cropInput: ""
    }
  });

  const searchMutation = useMutation({
    mutationFn: async (data: CropSearch) => {
      const response = await apiRequest("POST", "/api/crops/search", data);
      return response.json() as Promise<ProductMatchResponse>;
    },
    onSuccess: (data) => {
      setSearchResult(data);
      setSearchError(null);
    },
    onError: (error: Error) => {
      setSearchError(error.message);
      setSearchResult(null);
    }
  });

  const onSubmit = (data: CropSearch) => {
    searchMutation.mutate(data);
  };

  const fillCropInput = (cropName: string) => {
    form.setValue("cropInput", cropName);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">X</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">XrisP Nori Farm</h1>
                <p className="text-sm text-gray-600">Crop to Product Integration</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-gray-600">System Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Integration Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Virtual Crop Matcher</CardTitle>
            <p className="text-gray-600">Enter your crop name or NFT ID to find matching real-world products</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cropInput"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Name or NFT ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="e.g., Tomato #124, Lettuce #456, Carrot #789"
                            {...field}
                            className="pr-10"
                          />
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={searchMutation.isPending}
                >
                  {searchMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find Matching Product
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {searchError && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              <strong>No Matching Product Found:</strong> {searchError}
            </AlertDescription>
          </Alert>
        )}

        {/* Product Results */}
        {searchResult && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Display */}
            <Card>
              <CardHeader>
                <CardTitle>Matched Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <img 
                    src={searchResult.matchedProduct.image} 
                    alt={searchResult.matchedProduct.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{searchResult.matchedProduct.title}</h4>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold text-primary">{searchResult.matchedProduct.price}</span>
                      <Button asChild>
                        <a href={searchResult.matchedProduct.buyLink} target="_blank" rel="noopener noreferrer">
                          Buy Now
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* JSON Output */}
            <Card>
              <CardHeader>
                <CardTitle>API Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(searchResult, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feature Showcase */}
        <Card className="mb-12 bg-gradient-to-br from-primary to-green-600 text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Integration Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-sm text-white/90">AI-powered crop to product matching system</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Integration</h3>
                <p className="text-sm text-white/90">Live connection to shopping mall APIs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Quality Assurance</h3>
                <p className="text-sm text-white/90">Verified product matching and pricing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example Crops */}
        <Card>
          <CardHeader>
            <CardTitle>Example Crops</CardTitle>
            <p className="text-gray-600">Try these sample crop names to see the integration in action:</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exampleCrops.map((crop) => (
                <Button
                  key={crop.name}
                  variant="outline"
                  className="p-4 h-auto justify-start hover:bg-gray-100"
                  onClick={() => fillCropInput(crop.name)}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={crop.image} 
                      alt={crop.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{crop.name}</p>
                      <p className="text-sm text-gray-600">{crop.variety}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
