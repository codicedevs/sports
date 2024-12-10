async function getMatchesForUser(userId: string) {
    const user = await this.userModel.findById(userId).populate("preferredZones").exec();
  
    if (!user?.preferredZones || user.preferredZones.length === 0) {
      throw new Error("El usuario no tiene zonas preferidas configuradas.");
    }
  
    const zones = user.preferredZones;
  
    // Obtener todos los partidos cuya ubicación esté dentro de las zonas preferidas
    const matches = await this.matchModel
      .find()
      .populate({
        path: "location",
        match: {
          "location": {
            $geoWithin: {
              $geometry: {
                type: "MultiPolygon", // Si tienes múltiples zonas
                coordinates: zones.map((zone) => zone.location.coordinates),
              },
            },
          },
        },
      })
      .exec();
  
    return matches.filter((match) => match.location); // Filtrar los partidos que tienen una ubicación válida
  }

  

  