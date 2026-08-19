-- DropForeignKey
ALTER TABLE "public"."MovieView" DROP CONSTRAINT "MovieView_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."MovieView" DROP CONSTRAINT "MovieView_user_id_fkey";

-- AddForeignKey
ALTER TABLE "MovieView" ADD CONSTRAINT "MovieView_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieView" ADD CONSTRAINT "MovieView_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
