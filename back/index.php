<?php 
$con=mysqli_connect("127.0.0.1", "root", "", "cryptoChat");

$function=mysqli_real_escape_string($con,$_POST['function']);
$currency=mysqli_escape_string($con,$_POST['currency']);
$json=array();

switch ($function) {
	case 'get_messages':
		$last_msg_id=mysqli_escape_string($con,$_POST['last_msg_id']);

		if ($last_msg_id!='null') {
			$data=mysqli_query($con,"SELECT * FROM messages WHERE currency ='".$currency."' AND id > '".$last_msg_id."' LIMIT 50 ");
		} else{
			$data=mysqli_query($con,"SELECT * FROM messages WHERE currency ='".$currency."' ");
		}


		while($row =mysqli_fetch_assoc($data))
		{
		    $json[] = $row;
		}
		 echo(json_encode($json));

	break;
	case 'first_run':
		
		$data=mysqli_query($con,'SELECT * FROM messages WHERE currency ="'.$currency.'" LIMIT 50 ');

		while($row =mysqli_fetch_assoc($data))
		{
		    $json[] = $row;
		}
		 echo(json_encode($json));

		break;
	
	default:
		# code...
		break;
}

?>