-- DropForeignKey
ALTER TABLE "public"."SuggestionMovie" DROP CONSTRAINT "SuggestionMovie_movie_id_fkey";

-- AddForeignKey
ALTER TABLE "SuggestionMovie" ADD CONSTRAINT "SuggestionMovie_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
