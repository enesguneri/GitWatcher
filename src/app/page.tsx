// src/app/page.tsx
import connectToDatabase from '@/lib/mongodb'; // Veritabanı fonksiyonumuzu içeri aktarıyoruz

interface Repo {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    language: string | null;
}

export default async function Home() {
    await connectToDatabase();

    const response = await fetch('https://api.github.com/users/enesguneri/repos?sort=updated', {
        cache: 'no-store'
    });

    if (!response.ok) {
        return (
            <div className="p-10 text-center text-red-500 font-bold">
                Failed to load projects. You might have hit the GitHub API rate limit or the username is incorrect.
                <br/><br/>
                <span className="text-sm text-gray-500">
          Not: Eğer Rate Limit'e takıldıysan yaklaşık 45-60 dakika beklemen veya .env dosyasına token eklemen gerekebilir.
        </span>
            </div>
        );
    }

    const repos: Repo[] = await response.json();

    return (
        <main className="p-10 max-w-5xl mx-auto font-sans">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Developer Portfolio</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map((repo) => (
                    <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-blue-600 mb-2 truncate">{repo.name}</h2>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {repo.description || 'No description provided for this project.'}
                            </p>
                        </div>

                        <div className="flex items-center justify-between text-sm font-medium">
              <span className="flex items-center gap-1 text-gray-700">
                ⭐ {repo.stargazers_count}
              </span>
                            {repo.language && (
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                  {repo.language}
                </span>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </main>
    );
}