import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

function ActionAreaCard({ img, title, description, rating, number, onCheckAll, isViewed, isAuthenticated }) {
  const [isChecked, setIsChecked] = useState(isViewed);
  useEffect(() => {
    setIsChecked(isViewed);
  }, [isViewed])
  const handleChange = () => {
    onCheckAll();
  };


  return (
    <Card sx={{ maxWidth: 280, marginRight: 4, display: "inline-block" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={img}
          alt="Episod Poster"
        />
        <CardContent>
          <Typography style={{ textAlign: "center" }}>
            Episod {number}
          </Typography>
          <Typography gutterBottom variant="h6" component="div" style={{ textWrap: "balance", minHeight: "80px", textAlign: "center" }}>
            {title}
          </Typography>

          <div>
            <Typography variant="body2" color="text.secondary" style={{ textWrap: "balance", minHeight: "150px" }}>
              {description}
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">
              Rating: {rating}/10
            </Typography>
            {isAuthenticated && <FormControlLabel
              value="start"
              control={<Checkbox
                checked={isChecked}
                onChange={handleChange}
              />}
              label="Vizionat"
              labelPlacement="start"
            />}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
const mapStateToProps = state => {
  return {
    isAuthenticated: state.user.isAuthenticated
  }
}
export default connect(mapStateToProps, null)(ActionAreaCard);