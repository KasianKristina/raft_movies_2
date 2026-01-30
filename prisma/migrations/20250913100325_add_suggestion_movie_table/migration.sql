-- CreateTable
CREATE TABLE "SuggestionMovie" (
    "id" SERIAL NOT NULL,
    "suggestion_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,

    CONSTRAINT "SuggestionMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuggestionMovie_suggestion_id_movie_id_key" ON "SuggestionMovie"("suggestion_id", "movie_id");

-- AddForeignKey
ALTER TABLE "SuggestionMovie" ADD CONSTRAINT "SuggestionMovie_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "Suggestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestionMovie" ADD CONSTRAINT "SuggestionMovie_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
